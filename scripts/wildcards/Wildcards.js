//@api-1.0
// wildcards
// author wetcircuit
// v0.5
// Draw Things 1.20240502.2

// fallback prompt to be used if no wildcards are found in the UI prompt
//
const fallbackPrompt = "a {duck|cat|dog} in a {submarine|airplane|taxicab}...";

const configuration = pipeline.configuration;
const uiPrompt = pipeline.prompts.prompt;
var uiHint = "no wildcards found in the prompt.";

// look for wildcards in the UI prompt
//
  if (uiPrompt.includes('{') && uiPrompt.includes('|') && uiPrompt.includes('}')) {
		uiHint = "wildcard detected in the prompt.";
		// console.log(uiHint);
		promptString = uiPrompt;
    } else {
	  // console.log(uiHint);
		promptString = "";
  }

// UI
//
const userSelection = requestFromUser("Wildcards", "", function() {
  return [
	this.section("Prompt", uiHint, [
		this.textField(promptString, fallbackPrompt, true, 240),
		this.slider(10, this.slider.fractional(0), 1, 25, "batch count")
    ]),
	this.section("about", "Wildcards v0.5 by wetcircuit \n\ngenerate a batch of images using inline wildcards to randomize elements within the Prompt", [])
  ];
});

const batchCount = userSelection[0][1];
promptString = userSelection[0][0]

// run pipeline
//
console.log("\nwildcards prompt:\n");
console.log(promptString + "\n");

for (i = 0; i < batchCount; i++) {
editedString = replaceWildcards(promptString);
configuration.seed = -1;
let batchCountLog = `render ${i+1} of ${batchCount}`;
console.log(batchCountLog);
console.log(editedString);
let startTime = new Date().getTime();
pipeline.run({
    configuration: configuration,
    prompt: editedString
    });
var endTime = new Date().getTime();
var elapsedTime = (endTime - startTime) / 1000;
console.log("generated in " + elapsedTime + " seconds\n");
}

console.log("Job complete. Open Console to see job report.");

// functions

function replaceWildcards(inputString) {
    const wildcardRegex = /{([^}]+)}/g;

    function getRandomItem(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    function replaceWildcard(match) {
        const options = match.slice(1, -1).split('|');
        const randomOption = getRandomItem(options);
        return randomOption;
    }

    let editedString = inputString;

    while (wildcardRegex.test(editedString)) {
        editedString = editedString.replace(wildcardRegex, replaceWildcard);
    }

    return editedString;
}