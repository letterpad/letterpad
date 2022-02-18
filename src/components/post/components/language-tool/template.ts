interface Props {
  issueType: string;
  message: string;
  suggestionString: string;
  name: string;
}

export function getTemplate(args: Props, { offset }) {
  return `
<div contenteditable='false'>
    <p class='${args.issueType} issue-type'>${args.issueType}</p>
    <div class='content-area'>
        <p class='message'>${args.message}</p>
        <ul class='suggestion-list'>
            ${decorateSuggestions(args.suggestionString, offset)}
        </ul>
    </div>
    <p class='footer'><span onclick='window.parent.ignoreSuggestion(${offset},this)'>Ignore</span></p>
</div>
  `;
}

function decorateSuggestions(text: string, offset: number) {
  const words = text.split("###");
  const onClick = `window.parent.onSuggestionClick(${offset}, this)`;

  function getWord(suggestion: string) {
    return `<li onclick='${onClick}' data-word='${suggestion}'>${suggestion}</li>`;
  }
  return words.map(getWord).join("");
}
