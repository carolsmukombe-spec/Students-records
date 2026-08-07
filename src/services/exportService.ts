import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { RecordType, Student, RecordEntry, ExportOptions } from '../types';

export class ExportService {
  /**
   * Export Record Book entries to PDF
   */
  static exportToPDF(
    recordType: RecordType,
    studentsMap: Map<string, Student>,
    entries: RecordEntry[],
    options: ExportOptions
  ): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    const selectedCols = recordType.columns
      .filter(c => options.includeColumns.includes(c.id))
      .sort((a, b) => a.order - b.order);

    // Filter entries by students if provided
    let filteredEntries = entries.filter(e => e.recordTypeId === recordType.id);
    if (options.studentIds && options.studentIds.length > 0) {
      filteredEntries = filteredEntries.filter(e => options.studentIds!.includes(e.studentId));
    }

    // Header section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(24, 43, 73);
    doc.text(options.title || recordType.name, 14, 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);

    const subDetails: string[] = [];
    if (options.teacherName) subDetails.push(`Teacher: ${options.teacherName}`);
    if (options.schoolName) subDetails.push(`School: ${options.schoolName}`);
    subDetails.push(`Generated: ${new Date().toLocaleDateString()}`);

    doc.text(subDetails.join('  |  '), 14, 22);

    // Build Table Headers & Rows
    const tableHeaders = ['Student ID', 'Student Name', ...selectedCols.map(c => c.name)];

    const tableRows = filteredEntries.map(entry => {
      const student = studentsMap.get(entry.studentId);
      const studentId = student?.studentId || '-';
      const studentName = student?.name || 'Unknown Student';

      const rowValues = selectedCols.map(col => {
        const val = entry.data[col.id];
        if (val === undefined || val === null) return '';
        if (col.type === 'checkbox') return val ? 'Yes' : 'No';
        return String(val);
      });

      return [studentId, studentName, ...rowValues];
    });

    // Generate AutoTable
    autoTable(doc, {
      startY: 26,
      head: [tableHeaders],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [51, 65, 85]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { top: 26, left: 14, right: 14, bottom: 15 }
    });

    // Summary footer on last page
    const finalY = (doc as any).lastAutoTable?.finalY || 100;
    if (finalY < 180) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(`Total Records: ${filteredEntries.length}`, 14, finalY + 10);
    }

    doc.save(`${recordType.name.toLowerCase().replace(/\s+/g, '_')}_export.pdf`);
  }

  /**
   * Export Record Book entries to Excel (.xlsx)
   */
  static exportToExcel(
    recordType: RecordType,
    studentsMap: Map<string, Student>,
    entries: RecordEntry[],
    options: ExportOptions
  ): void {
    const selectedCols = recordType.columns
      .filter(c => options.includeColumns.includes(c.id))
      .sort((a, b) => a.order - b.order);

    let filteredEntries = entries.filter(e => e.recordTypeId === recordType.id);
    if (options.studentIds && options.studentIds.length > 0) {
      filteredEntries = filteredEntries.filter(e => options.studentIds!.includes(e.studentId));
    }

    const dataRows = filteredEntries.map(entry => {
      const student = studentsMap.get(entry.studentId);
      const rowObj: Record<string, any> = {
        'Student ID': student?.studentId || '',
        'Student Name': student?.name || 'Unknown Student'
      };

      selectedCols.forEach(col => {
        const val = entry.data[col.id];
        if (col.type === 'checkbox') {
          rowObj[col.name] = val ? 'Yes' : 'No';
        } else {
          rowObj[col.name] = val ?? '';
        }
      });

      return rowObj;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, recordType.name.substring(0, 30));

    XLSX.writeFile(workbook, `${recordType.name.toLowerCase().replace(/\s+/g, '_')}_export.xlsx`);
  }

  /**
   * Export Record Book entries to CSV
   */
  static exportToCSV(
    recordType: RecordType,
    studentsMap: Map<string, Student>,
    entries: RecordEntry[],
    options: ExportOptions
  ): void {
    const selectedCols = recordType.columns
      .filter(c => options.includeColumns.includes(c.id))
      .sort((a, b) => a.order - b.order);

    let filteredEntries = entries.filter(e => e.recordTypeId === recordType.id);
    if (options.studentIds && options.studentIds.length > 0) {
      filteredEntries = filteredEntries.filter(e => options.studentIds!.includes(e.studentId));
    }

    const dataRows = filteredEntries.map(entry => {
      const student = studentsMap.get(entry.studentId);
      const rowObj: Record<string, any> = {
        'Student ID': student?.studentId || '',
        'Student Name': student?.name || 'Unknown Student'
      };

      selectedCols.forEach(col => {
        const val = entry.data[col.id];
        if (col.type === 'checkbox') {
          rowObj[col.name] = val ? 'Yes' : 'No';
        } else {
          rowObj[col.name] = val ?? '';
        }
      });

      return rowObj;
    });

    const csvStr = Papa.unparse(dataRows);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${recordType.name.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Parse CSV File to import new Students
   */
  static parseStudentCSV(file: File): Promise<Partial<Student>[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as Record<string, any>[];
          const imported: Partial<Student>[] = [];

          rows.forEach((row, idx) => {
            // Find keys matching name, id, tags, notes
            const nameKey = Object.keys(row).find(k => /name|student_name|full_name/i.test(k));
            const idKey = Object.keys(row).find(k => /id|student_id|code|roll/i.test(k));
            const tagKey = Object.keys(row).find(k => /tag|group|category/i.test(k));
            const noteKey = Object.keys(row).find(k => /note|comment|remark/i.test(k));

            const name = nameKey ? row[nameKey]?.trim() : `Student ${idx + 1}`;
            if (name) {
              const tags = tagKey && row[tagKey] 
                ? String(row[tagKey]).split(/[,;]/).map(t => t.trim()).filter(Boolean)
                : [];

              imported.push({
                name,
                studentId: idKey ? String(row[idKey]).trim() : `STU-${1000 + idx}`,
                tags,
                notes: noteKey ? String(row[noteKey]).trim() : '',
                isArchived: false
              });
            }
          });

          resolve(imported);
        },
        error: (err) => reject(err)
      });
    });
  }
}
