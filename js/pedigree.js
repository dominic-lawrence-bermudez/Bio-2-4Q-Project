$(document).ready(function() {
	clearSVG();
	resetContent();
	
	id_pedigreeSVG.style.height = (2 * MAX_GENERATION * SYMBOL_LENGTH_px) + "px";
	
	// alert(SYMBOL_LENGTH_px);
});

// resize SVG when device is rotated
window.addEventListener("orientationchange", function(){
	setTimeout(function() {
		SYMBOL_LENGTH_px = parseFloat(document.getCSSPropertyById("id-pedigreeSVG", "width")) / 28.0;
		
		id_pedigreeSVG.style.height = (2 * MAX_GENERATION * SYMBOL_LENGTH_px) + "px";
	}, 1000);
});

//--- ----- Autosomal Traits

const eyeColor = new AutosomalTrait("Blue eye color", 'B', 'b', "brown eyes", "blue eyes", "recessive");
eyeColor.setDescription(
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed " +
	"do eiusmod tempor incididunt ut labore et dolore magna aliqua. " + 
	"Ut enim ad minim veniam, quis nostrud exercitation ullamco " +
	"laboris nisi ut aliquip ex ea commodo consequat. "
);

const widowsPeak = new AutosomalTrait("Widow's peak", 'W', 'w', "widow's peak present", "widow's peak absent", "dominant");
widowsPeak.setDescription(
	"describe here"
);

const tritanopia = new AutosomalTrait("Tritanopia", "T", "t", "blue-yellow colorblind", "not colorblind", "dominant");
tritanopia.setDescription(
	"blue-yellow colorblindness"
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
		
//---

function clearSVG() {
	while (id_pedigreeSVG.firstChild) {
		id_pedigreeSVG.removeChild(id_pedigreeSVG.firstChild);
	}
}

function resetContent() {
	id_traitExpressionDiv.style.display = "none";
	
		id_traitExpressionForm.elements["name-traitExpression"].selectedIndex = 0;
	
		id_traitExpressionOutput.innerHTML = "";
		id_traitExpressionOutput.style.display = "none";
	
	id_traitAnalysisDiv.style.display = "none";

		id_traitInfo.style.display = "none";
		
		resetTraitAnalysis();
}

//--- ----- 

var activeTraitName, activeTrait;
var ped1, pedGF, pedGM;

function generatePedigree() {
	console.clear();
	resetContent();
	
	//--- Pedigree Generation
	
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
	
	console.log("by Generation: ");
	console.log(ped1.Family.Generations);
	
	console.log("by Genotype: ");
	console.log(ped1.Family.MembersBySolvableGenotype);
	
	//--- Display HTML Divs
	
	id_traitExpressionDiv.style.display = "block";
	
		id_submitTraitExpression.disabled = false;
		id_submitTraitExpression.style.cursor = "pointer";
		
		for (let el of id_traitExpressionForm.getAllFormElements()) {
			el.disabled = false;
			el.style.cursor = "pointer";
		}
}

function submitTraitExpression() {
	for (let el of id_traitExpressionForm.getAllFormElements()) {
		el.disabled = true;
		el.style.cursor = "not-allowed";
	}
	
	id_traitExpressionOutput.style.display = "block";
	
	//--- -----
	
	const submit_expression = id_traitExpressionForm.elements["name-traitExpression"];
	
	if (submit_expression.value === ped1.ActiveTrait.Expression) {
		id_traitExpressionOutput.style.backgroundColor = "#BFB";
		id_traitExpressionOutput.innerHTML = "Correct: The trait is " + ped1.ActiveTrait.Expression + ".";
	} else {
		id_traitExpressionOutput.style.backgroundColor = "#FBB";
		id_traitExpressionOutput.innerHTML = "Incorrect: The trait is " + ped1.ActiveTrait.Expression + ".";
	}
	
	//--- ----- Display Trait Info
	
	id_traitAnalysisDiv.style.display = "block";
	
		id_traitInfo.style.display = "block";
	
	//---
	
	id_traitName.innerHTML = "Trait: " + activeTraitName;
	
	id_dominantTrait.innerHTML = "Dominant (" + activeTrait.DominantAllele + "): " + activeTrait.DominantPhenotype;
	id_recessiveTrait.innerHTML = "Recessive (" + activeTrait.RecessiveAllele + "): " + activeTrait.RecessivePhenotype;
	
	id_traitDescription.innerHTML = activeTrait.Description;
	
	//--- -----
	
	generateQuestion();
	
	return false;
}

//---

function resetTraitAnalysis() {
	id_traitAnalysisForm.reset();
	
	id_traitAnalysisOutput.innerHTML = "";
	id_traitAnalysisOutput.style.display = "none";
	
	id_nextQuestion.style.display = "none";
	
	// clear all input/select elements in the form when a new question is generated
	let traitAnalysisInputs = document.getElementsByClassName("class-traitAnalysisInput");
	
	while (traitAnalysisInputs[0])
		id_traitAnalysisForm.removeChild(traitAnalysisInputs[0]);
	
	for (let el of id_traitAnalysisForm.getAllFormElements()) {
		el.disabled = false;
		el.style.cursor = "pointer";
	}
}

var questionType;
var randomPerson;

function generateQuestion() {
	resetTraitAnalysis();
	
	//---
	
	/*
		01 - 
		02 - given a specific PedigreeID, ask for phenotype
		03 - given a specific PedigreeID, ask for genotype
	*/
	
	questionType = getRandomInteger(02, 03);

	switch (questionType) {
		case 01:
			break;
		case 02: {
			randomPerson = ped1.Family.getRandomMember();
			
			id_question.innerHTML = "What is " + randomPerson.PedigreeID + "'s phenotype for " + activeTraitName.toLowerCase() + "?";
			
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
		} case 03: {
			randomPerson = ped1.Family.getRandomMember();
			
			id_question.innerHTML = "What is " + randomPerson.PedigreeID + "'s genotype for " + activeTraitName.toLowerCase() + "?";
			
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
	id_traitAnalysisOutput.style.display = "block";
	
	switch (questionType) {
		case 01:
			break;
		case 02:
			if (randomPerson.AutosomalPhenotypes[activeTraitName] === id_traitAnalysisForm.elements["name-choicePhenotype"].value)
				id_traitAnalysisOutput.innerHTML = "Correct: " + randomPerson.PedigreeID + " has " + randomPerson.AutosomalPhenotypes[activeTraitName];
			else
				id_traitAnalysisOutput.innerHTML = "Incorrect: " + randomPerson.PedigreeID + " has " + randomPerson.AutosomalPhenotypes[activeTraitName];
			
			for (let el of id_traitAnalysisForm.getAllFormElements()) {
				el.disabled = true;
				el.style.cursor = "not-allowed";
			}
			
			break;
		case 03:
			if (randomPerson.Solver.SolvableZygosity === id_traitAnalysisForm.elements["name-choiceZygosity"].value)
				id_traitAnalysisOutput.innerHTML = "Correct: " + randomPerson.PedigreeID;
			else
				id_traitAnalysisOutput.innerHTML = "Incorrect: " + randomPerson.PedigreeID;
			
			if (randomPerson.Solver.SolvableZygosity === "unknown")
				id_traitAnalysisOutput.innerHTML += "'s zygosity cannot be determined.";
			else
				id_traitAnalysisOutput.innerHTML += " is " + randomPerson.Solver.SolvableZygosity + " for " + activeTraitName.toLowerCase();
			
			for (let el of id_traitAnalysisForm.getAllFormElements()) {
				el.disabled = true;
				el.style.cursor = "not-allowed";
			}
			
			break;
		default:
			logError("submitTraitAnalysis()", "The question type could not be determined.");
	}
	
	//--- -----
	
	id_nextQuestion.style.display = "block";
	
	return false;
}