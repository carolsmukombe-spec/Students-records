import { ColumnDefinition } from '../types';

export class CalculationService {
  /**
   * Calculates calculated column values based on row entry data and column definitions
   */
  static evaluateRow(
    columns: ColumnDefinition[],
    rowData: Record<string, any>
  ): Record<string, any> {
    const updatedData = { ...rowData };

    // Pass 1: Evaluate basic formulas like percentage, sum, average, difference
    for (const col of columns) {
      if (col.type === 'calculated' && col.formulaConfig) {
        const value = this.calculateColumnValue(col, updatedData);
        if (value !== undefined && value !== null) {
          updatedData[col.id] = value;
        }
      }
    }

    // Pass 2: Re-evaluate grades or chained calculations dependent on Pass 1 output
    for (const col of columns) {
      if (col.type === 'calculated' && col.formula === 'grade') {
        const scoreColId = col.formulaConfig?.scoreColId;
        const scoreVal = scoreColId ? updatedData[scoreColId] : null;
        if (scoreVal !== undefined && scoreVal !== null && scoreVal !== '') {
          const numScore = parseFloat(scoreVal);
          if (!isNaN(numScore)) {
            updatedData[col.id] = this.getLetterGrade(numScore);
          }
        }
      }
    }

    return updatedData;
  }

  private static calculateColumnValue(
    col: ColumnDefinition,
    data: Record<string, any>
  ): any {
    const cfg = col.formulaConfig;
    if (!cfg) return '';

    switch (col.formula) {
      case 'percentage': {
        const score = parseFloat(data[cfg.scoreColId || '']);
        const maxScore = parseFloat(data[cfg.maxScoreColId || '']);
        if (!isNaN(score) && !isNaN(maxScore) && maxScore > 0) {
          const pct = (score / maxScore) * 100;
          return Math.round(pct * 10) / 10; // 1 decimal
        }
        return '';
      }

      case 'grade': {
        const scoreVal = parseFloat(data[cfg.scoreColId || '']);
        if (!isNaN(scoreVal)) {
          return this.getLetterGrade(scoreVal);
        }
        return '';
      }

      case 'sum': {
        if (!cfg.sourceColIds || cfg.sourceColIds.length === 0) return 0;
        let total = 0;
        let hasValue = false;
        for (const cId of cfg.sourceColIds) {
          const val = parseFloat(data[cId]);
          if (!isNaN(val)) {
            total += val;
            hasValue = true;
          }
        }
        return hasValue ? Math.round(total * 100) / 100 : '';
      }

      case 'avg': {
        if (!cfg.sourceColIds || cfg.sourceColIds.length === 0) return 0;
        let total = 0;
        let count = 0;
        for (const cId of cfg.sourceColIds) {
          const val = parseFloat(data[cId]);
          if (!isNaN(val)) {
            total += val;
            count++;
          }
        }
        return count > 0 ? Math.round((total / count) * 10) / 10 : '';
      }

      case 'difference': {
        if (cfg.sourceColIds && cfg.sourceColIds.length >= 2) {
          const val1 = parseFloat(data[cfg.sourceColIds[0]]);
          const val2 = parseFloat(data[cfg.sourceColIds[1]]);
          if (!isNaN(val1) && !isNaN(val2)) {
            return Math.round((val1 - val2) * 100) / 100;
          }
        }
        return '';
      }

      case 'custom': {
        if (cfg.customFormula) {
          try {
            // Replace column tokens like {col_score} with actual numbers
            let expr = cfg.customFormula;
            Object.keys(data).forEach(cId => {
              const val = data[cId] ?? 0;
              const num = isNaN(parseFloat(val)) ? 0 : parseFloat(val);
              expr = expr.replaceAll(`{${cId}}`, num.toString());
            });
            // Safe evaluation of simple math
            if (/^[0-9+\-*/(). ]+$/.test(expr)) {
              // eslint-disable-next-line no-eval
              const res = Function(`"use strict"; return (${expr})`)();
              return isNaN(res) ? '' : Math.round(res * 100) / 100;
            }
          } catch (e) {
            return '';
          }
        }
        return '';
      }

      default:
        return '';
    }
  }

  public static getLetterGrade(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }

  public static getGradeColor(grade: string): string {
    switch (grade) {
      case 'A': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700';
      case 'B': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold border border-blue-300 dark:border-blue-700';
      case 'C': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-semibold border border-amber-300 dark:border-amber-700';
      case 'D': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 font-semibold border border-orange-300 dark:border-orange-700';
      case 'F': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 font-semibold border border-rose-300 dark:border-rose-700';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  }
}
