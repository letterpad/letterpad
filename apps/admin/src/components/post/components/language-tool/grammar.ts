import { getTemplate } from "./template";
import { startOfTag } from "./utils";
import { LanguageResponse, Match } from "../types";

interface CorrectionOffset {
  offset: number;
  length: number;
  index: number;
  match: Match;
}

type CorrectionOffsetList = { [offset: string]: CorrectionOffset };

export interface GrammarBase {
  activateListeners(html: HTMLElement, onChange: () => void): void;
  getSuggestedHtml(html: string, correction: LanguageResponse): string;
}

export default class Grammar implements GrammarBase {
  correctionOffsets: CorrectionOffsetList = {};
  html = "";
  output = "";
  onChange = () => null;

  public activateListeners(document: HTMLElement, onChange) {
    this.handleSuggestionClick(document);
    this.handleIgnoreSuggestionClick(document);
    this.onChange = onChange;
  }

  public getSuggestedHtml(html: string, correction: LanguageResponse) {
    this.html = html;
    this.setCorrectionOffsets(correction);
    return this.generateHtmlWithCorrections();
  }

  private setCorrectionOffsets(correction: LanguageResponse) {
    this.correctionOffsets = {};
    correction.matches.forEach((match, index) => {
      this.correctionOffsets[match.offset] = {
        offset: match.offset,
        length: match.length,
        index,
        match,
      };
    });
  }

  private generateHtmlWithCorrections() {
    const htmlLength = this.html.length;
    let inTag = 0;
    let offset = 0;
    let wordEndOffset = -1;
    this.output = "";

    const addToOutput = (chunk: string) => {
      this.output += chunk;
    };

    for (let i = 0; i < htmlLength; i++) {
      const letter = this.html[i];

      if (startOfTag(letter)) {
        inTag++;
        addToOutput(letter);
        continue;
      } else if (letter == ">") {
        inTag--;
        addToOutput(letter);
        continue;
      } else if (inTag === 0) {
        const suggestion = this.correctionOffsets[offset];
        if (suggestion) {
          const { issueType, category } = suggestion.match.rule;
          const suggestionString = suggestion.match.replacements
            .slice(0, 3)
            .map((suggestion) => suggestion.value)
            .join("###");

          const tooltip = getTemplate(
            {
              issueType,
              suggestionString,
              message: suggestion.match.message,
              name: category.name,
            },
            { offset }
          );
          this.output += `<span class="mark ${issueType}" data-tippy-content="${tooltip}" data-offset-start="${offset}">`;
          wordEndOffset = suggestion.length + i;
        }
        if (wordEndOffset === i) {
          this.output += "</span>";
        }
        offset++;
        this.output += letter;
      } else {
        this.output += letter;
      }
    }
    return this.output;
  }

  private handleSuggestionClick(dom) {
    //@ts-ignore
    window.onSuggestionClick = (offset: number, tooltipEle: HTMLElement) => {
      const markedEle = dom.querySelector(`[data-offset-start='${offset}']`);
      const suggestedWord = tooltipEle.innerHTML;
      if (suggestedWord) {
        const text = document.createTextNode(suggestedWord);
        markedEle?.parentNode?.replaceChild(text, markedEle);
        this.removeTooltip(tooltipEle);
        this.onChange();
      }
    };
  }

  private handleIgnoreSuggestionClick(dom: HTMLElement) {
    //@ts-ignore
    window.ignoreSuggestion = (offset: number, tooltipEle: HTMLElement) => {
      const markedEle = dom.querySelector(`[data-offset-start='${offset}']`);
      if (markedEle?.innerHTML) {
        const text = document.createTextNode(markedEle.innerHTML);
        markedEle.parentNode?.replaceChild(text, markedEle);
        this.removeTooltip(tooltipEle);
        this.onChange();
      }
    };
  }

  private removeTooltip(tooltipEle: HTMLElement) {
    while (typeof tooltipEle.dataset.tippyRoot === "undefined") {
      if (tooltipEle.parentElement) tooltipEle = tooltipEle.parentElement;
    }

    if (tooltipEle) {
      tooltipEle.parentNode?.removeChild(tooltipEle);
    }
  }
}
