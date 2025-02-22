declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number;
      filename?: string;
      image?: { type: string; quality: number };
      html2canvas?: { scale: number };
      jsPDF?: { 
        unit: string; 
        format: string; 
        orientation: string;
      };
    }
  
    interface Html2PdfWrapper {
      from(element: HTMLElement): Html2PdfWrapper;
      set(options: Html2PdfOptions): Html2PdfWrapper;
      save(): Promise<void>;
    }
  
    function html2pdf(): Html2PdfWrapper;
    export default html2pdf;
  }