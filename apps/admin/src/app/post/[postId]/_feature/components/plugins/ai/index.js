tinymce.PluginManager.add("ai", function (editor) {
  let lastTwoChars = "";
  let trigger = false;
  const marker = '<span id="t">.</span>';

  function removeLastThreeCharacters() {
    const editorRange = editor.selection.getRng(); // get range object for the current caret position

    const node = editorRange.commonAncestorContainer; // relative node to the selection

    range = document.createRange(); // create a new range object for the deletion
    range.selectNodeContents(node);
    range.setStart(node, editorRange.endOffset - 3); // current caret pos - 3
    range.setEnd(node, editorRange.endOffset); // current caret pos
    range.deleteContents();

    editor.focus();
  }

  // Event handler for keypress
  function handleKeypress(e) {
    const pressedChar = e.key;
    lastTwoChars += pressedChar;
    lastTwoChars = lastTwoChars.slice(-3);
    if (lastTwoChars === "+++") {
      trigger = true;
    }
  }

  // Event handler for keyup
  function handleKeyup(e) {
    if (trigger) {
      trigger = false;
      lastTwoChars = "";
      e.preventDefault();
      e.stopPropagation();
      removeLastThreeCharacters();
      editor.execCommand("mceInsertContent", false, marker);

      const aiContent = editor.getContent().split(marker)[0];
      const element = document.createElement("div");
      element.innerHTML = aiContent;
      element.querySelectorAll("pre").forEach((pre) => {
        pre.remove();
      });
      const prompt = element.textContent;
      removeText(marker.length);
      openAiCompletion(prompt).then((suggestedText) => {
        editor.execCommand("mceInsertContent", false, suggestedText);
      });
    }
  }

  function removeText() {
    editor.dom.remove(editor.dom.select("#t"));
    editor.focus();
  }

  // Register keypress and keyup events
  editor.on("keypress", handleKeypress);
  editor.on("keyup", handleKeyup);
});

function getPreviousBlocks(editor, currentBlock) {
  const previousBlocks = [];
  let sibling = currentBlock.previousSibling;
  const parentElement = currentBlock.parentElement;

  while (sibling) {
    if (sibling.nodeType === 1) {
      // Check if the node is an element node (excluding text nodes, etc.)
      previousBlocks.unshift(sibling);
    }
    sibling = sibling.previousSibling;
  }

  return previousBlocks;
}

async function openAiCompletion(prompt) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  });

  // Check if the response is okay
  // if (!response.ok) {
  //   throw new Error("Network response was not ok");
  // }

  // // Create a ReadableStream from the response body
  // const stream = response.body;

  // // Create a TextDecoder to decode the stream
  // const textDecoder = new TextDecoder();

  // // Read chunks from the stream
  // const reader = stream.getReader();

  // // Function to process each chunk
  // function processChunk({ done, value }) {
  //   if (done) {
  //     // Stream has ended
  //     return;
  //   }

  //   // Update the editor content with the new data
  //   updateEditorContent(value);

  //   // Continue reading the next chunk
  //   return reader.read().then(processChunk);
  // }

  // // Start reading chunks
  // return reader.read().then(processChunk);

  const text = await response.text();
  return text;
}
