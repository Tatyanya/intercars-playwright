export class ParserUtils {

    static parseCount(text: string): number {
        // tranform "&nbsp;(19848)" >>>>> 19848
        const match = text.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    static parsePrice(text: string): number {
        // Extracts the first decimal number from the text, e.g. "Price: 123.45 USD" -> 123.45
        const match = text.match(/[\d,.]+/);
        if (!match) return 0;
        // Replace comma with dot if comma is used as decimal separator
        const normalized = match[0].replace(',', '.');
        return parseFloat(normalized);
    }
}
