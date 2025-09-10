"use client";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { SessionUtils, ChatSession } from './sessionUtils';

export class ExportUtils {
  /**
   * Export session as Markdown file
   */
  static async exportAsMarkdown(session: ChatSession): Promise<void> {
    try {
      const markdown = SessionUtils.exportSessionAsMarkdown(session);
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      const filename = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.md`;
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting as Markdown:', error);
      throw new Error('Failed to export as Markdown');
    }
  }

  /**
   * Export session as PDF using html2canvas and jsPDF
   */
  static async exportAsPDF(session: ChatSession): Promise<void> {
    try {
      // Create a hidden container for rendering
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.padding = '40px';
      container.style.backgroundColor = '#ffffff';
      container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      container.style.lineHeight = '1.6';
      container.style.color = '#000000';
      
      // Generate HTML content
      const htmlContent = this.generateHTMLForPDF(session);
      container.innerHTML = htmlContent;
      
      // Append to body temporarily
      document.body.appendChild(container);
      
      // Convert to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        height: container.scrollHeight,
        width: 800
      });
      
      // Remove temporary container
      document.body.removeChild(container);
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [800, canvas.height]
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 800, canvas.height);
      
      // Download PDF
      const filename = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error('Error exporting as PDF:', error);
      throw new Error('Failed to export as PDF');
    }
  }

  /**
   * Generate HTML content for PDF export
   */
  private static generateHTMLForPDF(session: ChatSession): string {
    const header = `
      <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 10px 0; color: #111827;">
          ${this.escapeHtml(session.title)}
        </h1>
        <div style="font-size: 14px; color: #6b7280;">
          <p style="margin: 5px 0;"><strong>Created:</strong> ${new Date(session.createdAt).toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Updated:</strong> ${new Date(session.updatedAt).toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Messages:</strong> ${session.messages.length}</p>
        </div>
      </div>
    `;

    const messagesHtml = session.messages.map((message) => {
      const isUser = message.role === 'user';
      const icon = isUser ? '👤' : '🤖';
      const name = isUser ? 'You' : 'NEXUS AI';
      const bgColor = isUser ? '#f3f4f6' : '#e0f2fe';
      const borderColor = isUser ? '#d1d5db' : '#0ea5e9';
      
      let sourcesHtml = '';
      if (message.sources && message.sources.length > 0) {
        sourcesHtml = `
          <div style="margin-top: 15px; padding: 15px; background: #f9fafb; border-left: 3px solid #10b981; border-radius: 0 6px 6px 0;">
            <h4 style="font-size: 14px; font-weight: 600; margin: 0 0 10px 0; color: #065f46;">Sources:</h4>
            ${message.sources.map((source, idx) => `
              <div style="margin-bottom: 8px; font-size: 13px;">
                <strong>${idx + 1}.</strong> 
                <a href="${source.url}" style="color: #0ea5e9; text-decoration: none;">
                  ${this.escapeHtml(source.title)}
                </a>
                <span style="color: #6b7280;"> (${Math.round(source.score * 100)}% relevance)</span>
                ${source.snippet ? `<br><em style="color: #6b7280; margin-left: 20px;">"${this.escapeHtml(source.snippet)}"</em>` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }

      return `
        <div style="margin-bottom: 25px; page-break-inside: avoid;">
          <div style="
            background: ${bgColor}; 
            border: 1px solid ${borderColor}; 
            border-radius: 12px; 
            padding: 20px;
            position: relative;
          ">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 16px; margin-right: 8px;">${icon}</span>
              <strong style="font-size: 16px; color: #111827;">${name}</strong>
              <span style="font-size: 12px; color: #6b7280; margin-left: auto;">
                ${new Date(message.createdAt).toLocaleString()}
              </span>
            </div>
            <div style="color: #374151; font-size: 14px; white-space: pre-wrap; word-wrap: break-word;">
              ${this.escapeHtml(message.content).replace(/\n/g, '<br>')}
            </div>
            ${sourcesHtml}
          </div>
        </div>
      `;
    }).join('');

    const footer = `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
        <p>Generated by NEXUS AI Chat System</p>
        <p>Export Date: ${new Date().toLocaleString()}</p>
      </div>
    `;

    return header + messagesHtml + footer;
  }

  /**
   * Escape HTML to prevent XSS
   */
  private static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Export multiple sessions as a combined Markdown file
   */
  static async exportMultipleSessionsAsMarkdown(sessions: ChatSession[]): Promise<void> {
    try {
      const combined = sessions.map((session, index) => {
        const separator = index > 0 ? '\n\n---\n\n' : '';
        return separator + SessionUtils.exportSessionAsMarkdown(session);
      }).join('');

      const blob = new Blob([combined], { type: 'text/markdown;charset=utf-8' });
      const filename = `nexus_chat_export_${new Date().toISOString().split('T')[0]}.md`;
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting multiple sessions:', error);
      throw new Error('Failed to export sessions as Markdown');
    }
  }

  /**
   * Quick export options
   */
  static getExportFormats() {
    return [
      {
        id: 'markdown',
        name: 'Markdown (.md)',
        description: 'Text-based format with formatting',
        icon: '📝'
      },
      {
        id: 'pdf',
        name: 'PDF Document',
        description: 'Formatted document for sharing',
        icon: '📄'
      }
    ];
  }
}
