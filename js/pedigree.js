$(document).ready(function() {
	clearSVG();
	resetContent();
	
	id_pedigreeSVG.style.height = (2 * MAX_GENERATION * SYMBOL_LENGTH_px) + "px";
	
	// alert(SYMBOL_LENGTH_px);
});

window.addEventListener("resize", function() {
	SYMBOL_LENGTH_px = parseFloat(document.getCSSPropertyById("id-pedigreeSVG", "width")) / 28.0;
	
	id_pedigreeSVG.style.height = (2 * MAX_GENERATION * SYMBOL_LENGTH_px) + "px";
	
	//--- 
	
	//--- Resize Trait Analysis
	
	if (document.getCSSPropertyById("id-traitAnalysisDiv", "display") !== "none") {
		switch (breakpoint_minWidth) {
			case "800px":
				id_traitAnalysisDiv.style.display = "flex";
				break;
			case "600px":
				id_traitAnalysisDiv.style.display = "block";
				break;
			default:
				id_traitAnalysisDiv.style.display = "block";
				break;
		}
	}
	
	// if Trait Analysis div is flex and Trait Analysis output is not visible, set Trait Analysis form to use content height
	if ((document.getCSSPropertyById("id-traitAnalysisDiv", "display") === "flex") && (document.getCSSPropertyById("id-traitAnalysisDiv", "display") === "none")) {
		id_traitAnalysisForm.style.height = "100%";
	} else {
		id_traitAnalysisForm.style.height = "auto";
	}
});

//--- ----- Autosomal Traits

const eyeColor = new AutosomalTrait("Blue eye color", 'B', 'b', "brown eyes", "blue eyes", "recessive");
eyeColor.setPrintablePhenotypes(
	"has brown eyes",
	"has blue eyes"
);
eyeColor.setDescription(
	"A lack of melanin in the irises from a mutation results in blue eye color, compared to the usual brown."
);

const widowsPeak = new AutosomalTrait("Widow's peak", 'W', 'w', "widow's peak present", "widow's peak absent", "dominant");
widowsPeak.setPrintablePhenotypes(
	"has a widow's peak",
	"has no widow's peak"
);
widowsPeak.setDescription(
	"A widow's peak is a point in the hairline which is V-shaped. The point can be found in the center of the forehead"
);

const tritanopia = new AutosomalTrait("Tritanopia", "T", "t", "blue-yellow colorblind", "not colorblind", "dominant");
tritanopia.setPrintablePhenotypes(
	"is blue-yellow colorblind",
	"is not blue-yellow colorblind"
);
tritanopia.setDescription(
	"Tritanopia causes you to confuse yellow with violet and blue with green."
);

const huntingtonsDisease = new AutosomalTrait("Huntington's Disease", "H", "h", "affected by disease", "not affected by disease", "dominant");
huntingtonsDisease.setPrintablePhenotypes(
	"is affected by Huntington's disease",
	"is not affected by Huntington's disease"
);
huntingtonsDisease.setDescription(
	"Huntington's disease causes progressive dementia as a person enters adulthood. It mainly causes degeneration of nerve cells in the brain."
);

const marfansSyndrome = new AutosomalTrait("Marfan's Syndrome", "M", "m", "affected by trait", "not affected by trait", "dominant");
marfansSyndrome.setPrintablePhenotypes(
	"is affected by Marfan's Syndrome",
	"is not affected by Marfan's Syndrome"
);
marfansSyndrome.setDescription(
	"Marfan's syndrome results in abnormally long fingers and/or toes. Those affected tend to have slender bodies as well."
);

const albinism = new AutosomalTrait("Albinism", "A", "a", "not affected by trait", " affected by trait", "recessive");
albinism.setPrintablePhenotypes(
	"is not affected by Albinism",
	"is affected by Albinism"
);
albinism.setDescription(
	"Albinism is usually characterized by lack or absence of pigment in the hair, skin, and eyes. Due to the lack of skin pigmentation, those affected are susceptible to sunburn."
);

const corisDisease = new AutosomalTrait("Cori's Disease", "C", "c", "not affected by disease", "affected by disease", "recessive");
corisDisease.setPrintablePhenotypes(
	"is not affected by Cori's disease",
	"is affected by Cori's disease"
);
corisDisease.setDescription(
	"Cori's disease is usually characterized by stunted growth and build-up of glycogen in the organs."
);

const mcardlesDisease = new AutosomalTrait("McArdle's Disease", "M", "m", "affected by disease", "not affected by disease", "recessive");
mcardlesDisease.setPrintablePhenotypes(
	"is not affected by McArdle's disease",
	"is affected by McArdle's disease"
);
mcardlesDisease.setDescription(
	"People affected by McArdle's disease have weak muscles and can be fatigued easily."
);

//---  ----- HTML Elements by ID

const id_traitExpressionDiv = document.getElementById("id-traitExpressionDiv");
	const id_traitExpressionForm = document.getElementById("id-traitExpressionForm");
		const id_submitTraitExpression = document.getElementById("id-submitTraitExpression");
	const id_traitExpressionOutput = document.getElementById("id-traitExpressionOutput");

const id_traitAnalysisDiv = document.getElementById("id-traitAnalysisDiv");
	const id_traitInfo = document.getElementById("id-traitInfo");
		const id_traitName = document.getElementById("id-traitName");
		const id_dominantTrait = document.getElementById("id-dominantTrait");
		const id_recessiveTrait = document.getElementById("id-recessiveTrait");
		const id_traitDescription = document.getElementById("id-traitDescription");
	const id_traitAnalysisForm = document.getElementById("id-traitAnalysisForm");
		const id_question = document.getElementById("id-question");
		const id_submitTraitAnalysis = document.getElementById("id-submitTraitAnalysis");
		const id_traitAnalysisOutput = document.getElementById("id-traitAnalysisOutput");
		const id_nextQuestion = document.getElementById("id-nextQuestion");
		
//--- -----

function clearSVG() {
	while (id_pedigreeSVG.firstChild) {
		id_pedigreeSVG.removeChild(id_pedigreeSVG.firstChild);
	}
}

function resetContent() {
	id_traitExpressionDiv.style.display = "none";
	
	id_traitAnalysisDiv.style.display = "none";
}

var activeTraitName, activeTrait;
var ped1, pedGF, pedGM;

function generatePedigree() {
	console.clear();
	resetContent();
	
	//--- ----- Pedigree Generation
	
	// choose a random trait for the pedigree
	activeTraitName = Object.keys(DefinedAutosomalTraits).getRandomElement();
	activeTrait = DefinedAutosomalTraits[activeTraitName];
	
	// keep generating new pedigrees until a sizable and solvable one is obtained
	while (true) {
		clearSVG();

		ped1 = new Pedigree(activeTrait);
		pedGF = ped1.Family.Grandfather;
		pedGM = ped1.Family.Grandmother;

		ped1.layoutFamily(pedGF);

		if ((ped1.isContainableInSVG()) && (ped1.isSolvable()) && (ped1.Family.Generations[2].length > 0))
			break;
	}
	
	// log sorted family in console
	console.log("by Generation: ");
	console.log(ped1.Family.Generations);
	
	console.log("by Genotype: ");
	console.log(ped1.Family.MembersBySolvableZygosity);
	
	//--- ----- Display Trait Expression
	
	id_traitExpressionDiv.style.display = "block";
	
	resetTraitExpression();
}

//----- 

function resetTraitExpression() {
	// select "blank" option by default
	id_traitExpressionForm.elements["name-traitExpression"].selectedIndex = 0;
	
	// enable interaction with Trait Expression form elements
	for (let el of id_traitExpressionForm.getAllFormElements()) {
		el.disabled = false;
		el.style.cursor = "pointer";
	}
	
	// clear and hide Trait Expression output
	id_traitExpressionOutput.innerHTML = "";
	id_traitExpressionOutput.style.display = "none";
}

function submitTraitExpression() {
	// disable interaction with Trait Expression form elements
	for (let el of id_traitExpressionForm.getAllFormElements()) {
		el.disabled = true;
		el.style.cursor = "not-allowed";
	}
	
	// show Trait Expression output
	id_traitExpressionOutput.style.display = "block";
	
	//--- ----- Check Answer to Trait Expression
	
	const submit_expression = id_traitExpressionForm.elements["name-traitExpression"];
	
	if (submit_expression.value === ped1.ActiveTrait.Expression) {
		id_traitExpressionOutput.style.backgroundColor = document.getRootCSSProperty("--correct-borderless-fill");
		id_traitExpressionOutput.innerHTML = "Correct: ";
	} else {
		id_traitExpressionOutput.style.backgroundColor = document.getRootCSSProperty("--incorrect-borderless-fill");
		id_traitExpressionOutput.innerHTML = "Incorrect: ";
	}
	
	id_traitExpressionOutput.innerHTML += "The trait is " + ped1.ActiveTrait.Expression + ".";
	
	//--- ----- Display Trait Analysis
	
	switch (breakpoint_minWidth) {
		case "800px":
			id_traitAnalysisDiv.style.display = "flex";
			break;
		case "600px":
			id_traitAnalysisDiv.style.display = "block";
			break;
		default:
			id_traitAnalysisDiv.style.display = "block";
			break;
	}
		
	//--- Display Trait Info
	
	id_traitName.innerHTML = "Trait: " + activeTraitName;
	
	id_dominantTrait.innerHTML = "Dominant (" + activeTrait.DominantAllele + "): " + activeTrait.DominantPhenotype;
	id_recessiveTrait.innerHTML = "Recessive (" + activeTrait.RecessiveAllele + "): " + activeTrait.RecessivePhenotype;
	
	id_traitDescription.innerHTML = activeTrait.Description;
	
	//---
	
	resetQuestions();
	
	generateQuestion();
	
	return false;
}

//--- ----- Trait Analysis

var questions = {
	"01": true,
	"02": true,
	"03": true,
};

function resetQuestions() {
	for (let type in questions) {
		questions[type] = true;
	}
}

function resetTraitAnalysis() {
	if (document.getCSSPropertyById("id-traitAnalysisDiv", "display") === "flex") {
		// if (display: flex), set form to use content height over flexbox height equality
		id_traitAnalysisForm.style.height = "100%";
	}
	
	// clear all input/select elements in the form when a new question is generated
	let traitAnalysisInputs = document.getElementsByClassName("class-traitAnalysisInput");
	
	while (traitAnalysisInputs[0]) {
		id_traitAnalysisForm.removeChild(traitAnalysisInputs[0]);
	}
	
	// enable interaction with Trait Analysis form elements
	for (let el of id_traitAnalysisForm.getAllFormElements()) {
		el.disabled = false;
		el.style.cursor = "pointer";
	}
	
	//---
	
	// clear and hide Trait Analysis output
	id_traitAnalysisOutput.innerHTML = "";
	id_traitAnalysisOutput.style.display = "none";
	
	// hide new question button
	id_nextQuestion.style.display = "none";
}


var questionType;

var notGuessed;
var randomPerson;

function generateQuestion() {
	resetTraitAnalysis();
	
	/*
		01 - identify PedigreeIDs of all heterozygous individuals
		02 - given a specific PedigreeID, ask for phenotype
		03 - given a specific PedigreeID, ask for genotype
	*/
	
	do {
		questionType = Object.keys(questions).getRandomElement();
	} while (!(questions[questionType]));

	switch (questionType) {
		case "01":
			notGuessed = ped1.Family.MembersBySolvableZygosity.Heterozygous.length;
			
			for (let i = 0; i < ped1.Family.MembersBySolvableZygosity.Heterozygous.length; i++){
				ped1.Family.MembersBySolvableZygosity.Heterozygous[i].Solver.Guessed = false;
			}
			
			id_question.innerHTML = "Give the Pedigree IDs of individuals that can be determined as Heterozygous";
			
			let select_pedigreeIDGeneration = document.createElement("select");
			select_pedigreeIDGeneration.setAttribute("name", "name-choicePedigreeIDGeneration");
			select_pedigreeIDGeneration.setAttribute("class", "class-traitAnalysisInput");
			select_pedigreeIDGeneration.setAttribute("required", "required");
			
			let select_pedigreeIDNumber = document.createElement("select");
			select_pedigreeIDNumber.setAttribute("name", "name-choicePedigreeIDNumber");
			select_pedigreeIDNumber.setAttribute("class", "class-traitAnalysisInput");
			select_pedigreeIDNumber.setAttribute("required", "required");
			
			let option1_blank = document.createElement("option");
			option1_blank.setAttribute("hidden", "hidden");
			option1_blank.setAttribute("disabled", "disabled");
			option1_blank.setAttribute("selected", "selected");
			select_pedigreeIDGeneration.append(option1_blank);
			
			let option2_blank = document.createElement("option");
			option2_blank.setAttribute("hidden", "hidden");
			option2_blank.setAttribute("disabled", "disabled");
			option2_blank.setAttribute("selected", "selected");
			select_pedigreeIDNumber.append(option2_blank);
			
			let options = [
				"I",
				"II",
				"III",
				"IV"
			];
			
			let options2 = ped1.Family.PedigreeIDOptions;
			
			for (let i = 0; i < options.length; i++) {
				let opt = document.createElement("option");
				opt.text = options[i];
				opt.setAttribute("value", options[i]);
				
				select_pedigreeIDGeneration.append(opt);
			}
			
			for (let i = 0; i < options2.length; i++) {
				let opt = document.createElement("option");
				opt.text = options2[i];
				opt.setAttribute("value", options2[i]);
				
				select_pedigreeIDNumber.append(opt);
			}
			
			id_traitAnalysisForm.insertBefore(select_pedigreeIDGeneration, id_submitTraitAnalysis);
			id_traitAnalysisForm.insertBefore(select_pedigreeIDNumber, id_submitTraitAnalysis);
			
			// prevent question "01" from being generated again
			questions["01"] = false;
			
			break;
		case "02": {
			randomPerson = ped1.Family.getRandomMember();

			id_question.innerHTML = "What is " + randomPerson.PedigreeID + "'s phenotype for " + activeTraitName + "?";
			
			//---
			
			let select_phenotype = document.createElement("select");
			select_phenotype.setAttribute("name", "name-choicePhenotype");
			select_phenotype.setAttribute("class", "class-traitAnalysisInput");
			select_phenotype.setAttribute("required", "required");
			
			let option_blank = document.createElement("option");
			option_blank.setAttribute("hidden", "hidden");
			option_blank.setAttribute("disabled", "disabled");
			option_blank.setAttribute("selected", "selected");
			select_phenotype.append(option_blank);
			
			let options = [
				activeTrait.DominantPhenotype,
				activeTrait.RecessivePhenotype
			];
			
			for (let i = 0; i < options.length; i++) {
				let opt = document.createElement("option");
				opt.text = options[i];
				opt.setAttribute("value", options[i]);
				
				select_phenotype.append(opt);
			}
			
			id_traitAnalysisForm.insertBefore(select_phenotype, id_submitTraitAnalysis);
			
			break;
		} case "03": {
			randomPerson = ped1.Family.getRandomMember();
			
			id_question.innerHTML = "What is " + randomPerson.PedigreeID + "'s zygosity for " + activeTraitName + "?";
			
			//---
			
			let select_zygosity = document.createElement("select");
			select_zygosity.setAttribute("name", "name-choiceZygosity");
			select_zygosity.setAttribute("class", "class-traitAnalysisInput");
			select_zygosity.setAttribute("required", "required");
			
			let option_blank = document.createElement("option");
			option_blank.setAttribute("hidden", "hidden");
			option_blank.setAttribute("disabled", "disabled");
			option_blank.setAttribute("selected", "selected");
			select_zygosity.append(option_blank);
			
			let options = [
				["Homozygous Dominant", "homozygous dominant"],
				["Heterozygous", "heterozygous"],
				["Homozygous Recessive", "homozygous recessive"],
				["Cannot be determined", "unknown"]
			];
				
			for (let i = 0; i < options.length; i++) {
				let opt = document.createElement("option");
				opt.text = options[i][0];
				opt.setAttribute("value", options[i][1]);
				
				select_zygosity.append(opt);
			}
			
			id_traitAnalysisForm.insertBefore(select_zygosity, id_submitTraitAnalysis);
			
			break;
		} default:
			logError("generateQuestion()", "The given for the question could not be produced.");
			return;
	}
}

function submitTraitAnalysis() {
	if (document.getCSSPropertyById("id-traitAnalysisDiv", "display") === "flex") {
		// if (display: flex), set form to conform to flexbox height equality
		id_traitAnalysisForm.style.height = "auto";
	}
	
	// show Trait Analysis output
	id_traitAnalysisOutput.style.display = "block";
	
	switch (questionType) {
		case "01":
			let guessedPedigreeIDGeneration = id_traitAnalysisForm.elements["name-choicePedigreeIDGeneration"].value;
			let guessedPedigreeIDNumber = id_traitAnalysisForm.elements["name-choicePedigreeIDNumber"].value;
			
			if (ped1.Family.Generations[toArabicNumeral(guessedPedigreeIDGeneration)-1][guessedPedigreeIDNumber-1] == null) {
				id_traitAnalysisOutput.style.backgroundColor = "transparent";
				id_traitAnalysisOutput.style.border = "0px solid black";
				id_traitAnalysisOutput.innerHTML = "Please choose a proper Pedigree ID.";
				return false;
			} else {
				/*
				let guessedPerson = ped1.Family.Generations[toArabicNumeral(guessedPedigreeIDGeneration)-1][guessedPedigreeIDNumber-1];
				
				if (guessedPerson.Solver.SolvableZygosity === "heterozygous" && !(guessedPerson.Solver.Guessed)) {
					person1.Solver.Guessed = true;
					notGuessed--;
					
					id_traitAnalysisOutput.style.backgroundColor = document.getRootCSSProperty("--correct-bordered-fill");
					id_traitAnalysisOutput.style.border = document.getRootCSSProperty("--correct-border");
					id_traitAnalysisOutput.innerHTML = "Correct: " + guessedPerson.PedigreeID + "'s zygosity is Heterozygous, " + notGuessed +" more to go!";
					
					if (notGuessed == 0)
						break;
				} else {
					id_traitAnalysisOutput.style.backgroundColor = document.getRootCSSProperty("--incorrect-bordered-fill");
					id_traitAnalysisOutput.style.border = document.getRootCSSProperty("--incorrect-border");
					id_traitAnalysisOutput.innerHTML = "Incorrect: " + guessedPedigreeIDGeneration + "-" + guessedPedigreeIDNumber + "'s zygosity is " + guessedPerson.AutosomalZygosities[activeTraitName];
				
					id_traitAnalysisOutput.innerHTML += (guessedPerson.AutosomalZygosities[activeTraitName] === "heterozygous") ? " but cannot be determined." : ".";
				}
				*/
				
				for (let i = 0; i < ped1.Family.MembersBySolvableZygosity.Heterozygous.length; i++) {
					let person1 = ped1.Family.MembersBySolvableZygosity.Heterozygous[i]
					
					if (person1.PedigreeID == guessedPedigreeIDGeneration + "-" + guessedPedigreeIDNumber) {
						if (!(person1.Solver.Guessed)) {
							notGuessed--;
							person1.Solver.Guessed = true;
						}
						
						id_traitAnalysisOutput.style.backgroundColor = document.getRootCSSProperty("--correct-bordered-fill");
						id_traitAnalysisOutput.style.border = document.getRootCSSProperty("--correct-border");
						id_traitAnalysisOutput.innerHTML = "Correct: " + person1.PedigreeID + "'s zygosity is Heterozygous, " + notGuessed +" more to go!";
						
						if (notGuessed == 0) {
							break;
						} else {
							return false;
						}
					}
				}
				
				if (notGuessed == 0) {
					break;
				} else if (ped1.Family.Generations[toArabicNumeral(guessedPedigreeIDGeneration)-1][guessedPedigreeIDNumber-1].AutosomalZygosities[activeTraitName] != "heterozygous"){
					id_traitAnalysisOutput.style.backgroundColor = document.getRootCSSProperty("--incorrect-bordered-fill");
					id_traitAnalysisOutput.style.border = document.getRootCSSProperty("--incorrect-border");
					id_traitAnalysisOutput.innerHTML = "Incorrect: " + guessedPedigreeIDGeneration + "-" + guessedPedigreeIDNumber + "'s zygosity is " + ped1.Family.Generations[toArabicNumeral(guessedPedigreeIDGeneration)-1][guessedPedigreeIDNumber-1].AutosomalZygosities[activeTraitName];
				} else {
					id_traitAnalysisOutput.style.backgroundColor = document.getRootCSSProperty("--incorrect-bordered-fill");
					id_traitAnalysisOutput.style.border = document.getRootCSSProperty("--incorrect-border");
					id_traitAnalysisOutput.innerHTML = "Incorrect: " + guessedPedigreeIDGeneration + "-" + guessedPedigreeIDNumber + "'s zygosity is " + ped1.Family.Generations[toArabicNumeral(guessedPedigreeIDGeneration)-1][guessedPedigreeIDNumber-1].AutosomalZygosities[activeTraitName] + " but cannot be determined";
				}
				
				return false;
			}
		case "02":
			let guessedPhenotype = id_traitAnalysisForm.elements["name-choicePhenotype"].value;
			let correctPhenotype = randomPerson.AutosomalPhenotypes[activeTraitName];
		
			id_traitAnalysisOutput.innerHTML = (guessedPhenotype === correctPhenotype) ? "Correct: " : "Incorrect: ";
			
			if (guessedPhenotype === correctPhenotype) {
				id_traitAnalysisOutput.style.backgroundColor = document.getRootCSSProperty("--correct-bordered-fill");
				id_traitAnalysisOutput.style.border = document.getRootCSSProperty("--correct-border");
				id_traitAnalysisOutput.innerHTML = "Correct: ";
			} else {
				id_traitAnalysisOutput.style.backgroundColor = document.getRootCSSProperty("--incorrect-bordered-fill");
				id_traitAnalysisOutput.style.border = document.getRootCSSProperty("--incorrect-border");
				id_traitAnalysisOutput.innerHTML = "Incorrect: ";
			}
			
			id_traitAnalysisOutput.innerHTML += randomPerson.PedigreeID + " " + activeTrait.getPrintablePhenotypeFromGene(randomPerson.AutosomalGenes[activeTraitName]) + ".";
			
			break;
		case "03": {
			let guessedZygosity = id_traitAnalysisForm.elements["name-choiceZygosity"].value;
			let correctZygosity = randomPerson.Solver.SolvableZygosity;
			
			if (guessedZygosity === correctZygosity) {
				id_traitAnalysisOutput.style.backgroundColor = document.getRootCSSProperty("--correct-bordered-fill");
				id_traitAnalysisOutput.style.border = document.getRootCSSProperty("--correct-border");
				id_traitAnalysisOutput.innerHTML = "Correct: ";
			} else {
				id_traitAnalysisOutput.style.backgroundColor = document.getRootCSSProperty("--incorrect-bordered-fill");
				id_traitAnalysisOutput.style.border = document.getRootCSSProperty("--incorrect-border");
				id_traitAnalysisOutput.innerHTML = "Incorrect: ";
			}
			if (randomPerson.Solver.SolvableZygosity === "unknown")
				id_traitAnalysisOutput.innerHTML += randomPerson.PedigreeID + "'s zygosity cannot be determined.";
			else
				id_traitAnalysisOutput.innerHTML += randomPerson.PedigreeID + " is " + randomPerson.Solver.SolvableZygosity + " for " + activeTraitName + ".";
			
			break;
		} default:
			logError("submitTraitAnalysis()", "The question type could not be determined.");
	}
	
	//--- -----
	
	// disable interaction with Trait Analysis form
	for (let el of id_traitAnalysisForm.getAllFormElements()) {
		el.disabled = true;
		el.style.cursor = "not-allowed";
	}
	
	// show button to generate a new question
	id_nextQuestion.style.display = "block";
	
	return false;
}