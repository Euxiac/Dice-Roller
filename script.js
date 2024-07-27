//========DATA=============================================================================
let availableDice = { D4: 4, D6: 6, D8: 8, D10: 10, D12: 12, D20: 20 };
let rollHistory = [];
let uiRoller = {RollHistory: "roll some dice!", DiceTotal: "00", D4: " ", D6: " ", D8: " ", D10: " ", D12: " ", D20: " "}
let savedRolls = [];

//========FUNCTIONS========================================================================
function updateUI()
{
    calculateTotal()
    document.getElementById('resultTray').children[0].textContent = getValueByKey(uiRoller, 'RollHistory');
    document.getElementById('resultTray').children[2].textContent = getValueByKey(uiRoller, 'DiceTotal');
    document.getElementById('D4').children[1].textContent = getValueByKey(uiRoller, 'D4');
    document.getElementById('D6').children[1].textContent = getValueByKey(uiRoller, 'D6');
    document.getElementById('D8').children[1].textContent = getValueByKey(uiRoller, 'D8');
    document.getElementById('D10').children[1].textContent = getValueByKey(uiRoller, 'D10');
    document.getElementById('D12').children[1].textContent = getValueByKey(uiRoller, 'D12');
    document.getElementById('D20').children[1].textContent = getValueByKey(uiRoller, 'D20');
}

function rollDice(dice)
{
    let roll = generateRoll(dice);
    uiRoller[dice]=parseLeading(roll)
    updateRollHistory(dice, roll);
    updateUI();
}


function updateRollHistory(dice, roll)
{
    rollHistory.push({[dice]:roll});
    formatRollHistory();
    updateUI();
    
}

function calculateTotal(){
    let total = 0;
    for (let i = 0; i < rollHistory.length; i++)
    {
        let value = rollHistory[i][Object.keys(rollHistory[i])[0]];
        total = total + value;
    }
    uiRoller['DiceTotal'] = total;
}

function formatRollHistory(){
    if (uiRoller['RollHistory']==="roll some dice!") uiRoller['RollHistory']="";
    let formattedText = "";
    for (let i = 0; i < rollHistory.length; i++)
        {
            let key = Object.keys(rollHistory[i])[0];
            let value = rollHistory[i][Object.keys(rollHistory[i])[0]];
            formattedText = uiRoller['RollHistory'] + key + "=" + value+ ", ";
        }
    uiRoller['RollHistory']=formattedText;
}

function resetRolls()
{
    uiRoller = {RollHistory: "roll some dice!", DiceTotal: "00", D4: " ", D6: " ", D8: " ", D10: " ", D12: " ", D20: " "}
    rollHistory = [];
    updateUI();
}

function clearSession()
{
    resetRolls();
}

//Main roll function
function generateRoll(dice) {
    if (!checkExists(availableDice,dice)) return; //check if exists
    const min = 1;
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(getValueByKey(availableDice, dice));
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

//========UTILITIES=========================================================================
// grabs the value of a key in an array
function getValueByKey(library, key) {
    if (checkExists) return library[key];
}

// checks if the key you entered exists within the array
function checkExists(library, query) {
  let checkExists = 0;
  for (const key in availableDice) {
    if (query === key) checkExists++;
  }
  if (checkExists < 1) {
    console.error("key does not exist: " + query);
    return false;
  } else return true;
}

function parseLeading(number)
{
    if(number< 10){
        return "0" + number;
        }
        else{
        return number;
        }
}

//========UNIT TESTS=========================================================================
//This test aims to test the generation of the dice over large numbers.
function generationTest (dice, generations) //rolls dice generationsX and counts results per
{
    console.log("!! starting generation test for " + generations + " of " +dice + " !!");
    let pass = true;
    if (!checkExists(availableDice,dice)) return false;

    ceiling = getValueByKey(availableDice, dice)+1;
    let testArr = []
    totalProbability= [];

    //roll generationsX of dice
    for (let i = 0; i < generations; i++)
    {
        testArr.push(generateRoll(dice));
    }
    console.log(testArr);
    console.log("generated "+ testArr.length + " rolls of " + dice)
    
    /* So here we want it to look through the generated dice and count how many of each number we got to 
    check the probabilities are right and that we are getting all the numbers we want. We want to also track 0 and a number above
    the ceiling to make sure we aren't getting bleed. We are also checking that the sum of all the generations equal 100% else 
    we are losing numbers somewhere*/
    for (let num = 0; num < ceiling+1; num++) //For every number counter to the dice max +1
    {
        let counter = 0;
        // iterate through the generated numbers and increase counter if the number matches tracked number
        for (let i = 0; i < testArr.length; i++)
            {
                if (testArr[i] === num)counter++;
            }
        let probablityOfNum = counter/generations*100; //check the probability in %
        totalProbability.push(probablityOfNum); //add percentage to the totalProbability array
        console.log("there are "+counter+" of "+num+" in "+testArr.length+" generations. Probability of "+ probablityOfNum+ "%")

        if (num===0 || num>=ceiling)
            {
                if (counter>0) pass=false;
                console.log(num+ "" +counter+" "+pass);
            }
    }
    
    //sum the total probability array
    let sum = totalProbability.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log("total probabilty at " + sum + "%");
    if (totalProbability < 100) pass=false;

    if (pass===true)return true;
    else if (pass===false)return false;
}

function runGenerationTest ()
{
    console.log("GENERATION TEST PASSED? = "+ generationTest("test",200));
    console.log("GENERATION TEST PASSED? = "+generationTest("D4",200));
    console.log("GENERATION TEST PASSED? = "+generationTest("D6",200));
    console.log("GENERATION TEST PASSED? = "+generationTest("D8",200));
    console.log("GENERATION TEST PASSED? = "+generationTest("D10",200));
    console.log("GENERATION TEST PASSED? = "+generationTest("D12",200));
    console.log("GENERATION TEST PASSED? = "+generationTest("D20",200));
}

//runGenerationTest();

updateUI();