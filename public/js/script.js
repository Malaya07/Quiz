let lifeCount=document.querySelector('.life-count')
const startBtn = document.querySelector(".start");
const popupInfo = document.querySelector(".popup-info");
const main = document.querySelector(".main");
const continueBtn = document.querySelector(".continue-btn");
const quizSection = document.querySelector(".quiz-section");
const quizBox = document.querySelector(".quiz-box");
const next = document.querySelector(".next-btn");
const option_list=document.querySelector(".option-list")
const resultBox = document.querySelector(".result-box");
const submit=document.querySelector(".submit")

//start
startBtn.addEventListener("click", function () {
    fetch('/hello')
    .then(response => {
        if (!response.ok) {
            throw new Error('Unauthorized'); // Unauthorized access, throw error
        }
        return response.json(); // Parse response JSON
    })
    .then(data => {
        // Handle successful response data
        popupInfo.classList.add("active");
        main.classList.add("active");
    })
    .catch(error => {
        console.error('Authentication error:', error);
        // Handle unauthorized access error
    });
});



//exit
const exitBtn = document.querySelector(".exit-btn");
exitBtn.addEventListener("click", function () {
  popupInfo.classList.remove("active");
  main.classList.remove("active");
});
//continue
let questioncoutn = 0;
continueBtn.addEventListener("click", function () {
  quizSection.classList.add("active");
  popupInfo.classList.remove("active");
  main.classList.remove("active");
  quizBox.classList.add("active");
  showQuestion(questioncoutn); 
});
function showQuestion(index) {
  const questionText = document.querySelector(".question-text");
  questionText.textContent = `${questions[index].question}`;

  let option = `<div class= "option"><span>${questions[index].options[0]} </span></div>
  <div class= "option"><span>${questions[index].options[1]} </span></div>
  <div class= "option"><span>${questions[index].options[2]} </span></div>
  <div class= "option"><span>${questions[index].options[3]} </span></div>
  `

    option_list.innerHTML=option;
    const optionList=document.querySelectorAll(".option");
    for(let i=0;i<optionList.length;i++){
        optionList[i].setAttribute('onclick','optionSelected(this)')
    }
    next.classList.add("disabled")
}
let score=0
let liferem=3
function optionSelected(answer){
    answer.classList.add("selected");
    let userAns=answer.textContent[0];
    
        let correctAns=questions[questioncoutn].answer;
    let alloptions=option_list.children.length;
    if(userAns == correctAns){
        score++;
        console.log(score)
    }
    else{
        liferem--
       
    }
    
    for(let i=0;i< alloptions;i++){
        option_list.children[i].classList.add('disabled')
    }
    next.classList.remove( 'disabled');
   
}

next.addEventListener('click',function(){
    if(liferem==0 || questioncoutn==questions.length-1){
        result(score);
    }
    else{
    questioncoutn++;
    showQuestion(questioncoutn);
    update(score,liferem);
    }
}) 

function update(score,liferem){
    
    const result=document.querySelector('.header-score')
    result.textContent="Score:"+score
    lifeCount.textContent=liferem
}
function result(score){
    resultBox.classList.add("active")
    quizBox.classList.remove("active")
    const finalScore = document.querySelector(".user_score")
   
    if(score<10  && score!=0){
        finalScore.textContent="0"+score
    }
    else{
        finalScore.textContent=score
    }
}

submit.addEventListener("click", function () {
    const scoreData =  { score } ; // Create an object to hold the score data
    
    fetch('/api/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(scoreData), // Send the score data as JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send score to server');
        }
        return response.json();
    })
    .then(data => {
        console.log('Score sent successfully:', data);
        window.location.href=''
    })
    .catch(error => {
        console.error('Error sending score:', error);
        // Handle error (if needed)
    });
});



