//--- ----- Generating a Family

function Family() {
	//--- "Adam and Eve"
	
	this.Grandfather = new Person(1, "male");
	this.Grandfather.assignRandomGenes();
	
	this.Grandmother = new Person(1, "female");
	this.Grandmother.assignRandomGenes();
	
	//--- Recursively Generating the Family Tree
	
	Person.marry(this.Grandfather, this.Grandmother);
	
	Person.haveChildren(this.Grandfather, this.Grandmother);
	
	for (let child of this.Grandfather.Children) {
		this.PRIV_continueFamily(child);
	}
	
	this.Members = this.Grandfather.getSubfamily_DF();
	
	//--- Placing the Family in an array by Generation
	
	this.Generations = [];

	for (let i = 0; i < MAX_GENERATION; i++)
		this.Generations[i] = [];
	
	for (let familyMember of this.Members) {
		let fmGeneration = familyMember.Generation;
		
		// set Pedigree ID for labelling purposes (I-1)
		let temp = this.Generations[fmGeneration - 1].length + 1;
		familyMember.PedigreeID = (fmGeneration.toRomanNumerals() + "-" + temp);
		
		this.Generations[fmGeneration - 1].push(familyMember);
	}
}

//recursive magic
Family.prototype.PRIV_continueFamily = function(person) {
	if (person.Generation <= MAX_GENERATION) {
		var personIsMarried = person.tryToMarry();
		
		if (personIsMarried) {
			Person.haveChildren(person, person.Partner);
			
			for (let child of person.Children) {
				this.PRIV_continueFamily(child);
			}
		}
	}
}