(function(window, document, undefined) {
   // pane elements and question objects
   /*function getStoredQuestions() {
     if (!localStorage.questions) {
           // default to empty array
           localStorage.questions = JSON.stringify([]);
       }

     return JSON.parse(localStorage.questions);
   }

   function storeQuestions(questions) {
       localStorage.questions = JSON.stringify(questions);
   }
    var rightPane = document.getElementById('right-pane');
    var leftPane = document.getElementById('left-pane');
    var allQuestions = [];
    var questions = getStoredQuestions();
    var currentQuestion;
    var favoriteQuestion = null;
    storeQuestions(questions);

    var questionFormTemplate = document.getElementById('question-form-template');
    var questionTemplate= document.getElementById('questions-template');
    var questionTemplateExp= document.getElementById('expanded-question-template');

    var templates = {
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML),
        renderQuestion: Handlebars.compile(questionTemplate.innerHTML),
        renderQuestionExp: Handlebars.compile(questionTemplateExp.innerHTML)
    };
    if(questions.length != 0)
    {
      allQuestions = questions;
      $('#left-pane').html(templates.renderQuestion({'allQuestions': allQuestions}));
    }


    $('#interactors').height($('#interactors').height());
    $('#interactors').width($('#interactors').width());
    $('#left-pane').height($('#left-pane').height());
    $('#left-pane').width($('#left-pane').width());

    rightPane.innerHTML = templates.renderQuestionForm();
    $('#hidePane').click(function()
    {
      $('#navigation').toggle('slow')
      if($($(this).children()[0]).attr('class') === 'fa fa-caret-right')
      {
        $('.fa-caret-right').attr('class', 'fa fa-caret-left');
      }
      else {
        $('.fa-caret-left').attr('class', 'fa fa-caret-right');
      }
    })

    //Append a question to the left pane, testing if all the values work of course
    function updateForm(event)
    {
      //Add an event listener for the button on the question form which will check if subject and question meet word minimum
      document.getElementById("question-form").querySelector(".btn").addEventListener('click', function updateQuestions(event)
      {
        //Create variables for set their values given a certain error
        event.preventDefault();
        var failedTests = false;
        var subjectValue = document.getElementById("question-form").querySelector('input[name="subject"]');
        var subjectValueError = document.getElementById("question-form").querySelector('label[for="Err1"]');
        var questionTextArea = document.getElementById("question-form").querySelector('textarea[name="question"]');
        var questionTextAreaError = document.getElementById("question-form").querySelector('label[for="Err2"]');

        //Keep track of the failedTests, and if it fails a test, set failedTest to true
        //Checks if a subject is empty, and displays error message
        if(subjectValue.value == "")
        {
          subjectValueError.innerHTML = "You can't have an empty subject!";
          failedTests = true;
        }
        else
        {
          subjectValueError.innerHTML = "";
        }

        //Checks if question is null
        if(questionTextArea.value == "")
        {
          questionTextAreaError.innerHTML = "You can't have an empty question!";
          failedTests = true;
        }
        //Checks if a question isn't between 50 and 500 chars.
        else if(questionTextArea.value.length < 50|| questionTextArea.value.length > 500)
        {
          questionTextAreaError.innerHTML = "Descriptions must be between 50 and 500 characters";
          failedTests = true;
        }

        //No errors with the question, so display no error
        else
        {
          questionTextAreaError.innerHTML = "";
        }

        //If failedTests is false (meaning it is valid) add it as a question object
        if(!failedTests)
        {
          allQuestions = [{id: Math.random() + 1, subject: subjectValue.value, question: questionTextArea.value, responses: [], votes: 0, upvoted: false, dontShow: true}];
          allQuestions[0].dontShow = false;
          questions.push(allQuestions[0]);
          storeQuestions(questions);
          $('#left-pane').html(templates.renderQuestion({'allQuestions': questions}));
          $($('#left-pane').children()[$('#left-pane').children().length-1]).slideDown('slow');
          $('.list-question').last().parent().click(function()
          {
            var specificQuestion = this.children[0].id;
            displayQuestion(specificQuestion);
          })
          subjectValue.value = "";
          questionTextArea.value = "";
          questionTextAreaError.innerHTML = "";
          subjectValueError.innerHTML = "";
        }
      });
    }

    //Call the update form
    updateForm();

    //This will take the question clicked on and display its thread, by modifying the right-panes HTML
    $('.list-question').parent().click(function displaySpecificThread(event)
    {
      event.preventDefault();
      var specificQuestion = this.children[0].id;
      displayQuestion(specificQuestion);
    });

    //Will find the question that will match the id by searching for a matching id in questions, and if it does, display that Question
    function displayQuestion(theQuestion)
    {
      //Find the index of the question that matches the id of the clicked, and display that
      var upvoted = true;
      var questionMatch;
      var index = 0;
      while(true)
      {
        if(theQuestion == questions[index].id)
        {
          questionMatch = index;
          break;
        }
        if(index > questions.length)
        {
          index = -1;
          break;
        }
        index++;
      }
      currentQuestion = questions[questionMatch];
      rightPane.innerHTML = templates.renderQuestionExp(questions[questionMatch]);
      //Current question is now the thread you clicked on

      //Check whether or not there is a favorite question. If there is not, display no circle for the question
      //and do the same for the current Question
      //If the favorite question is the current question, hide the favorite button, and display the circle
      if(favoriteQuestion == currentQuestion)
      {
        document.querySelector('input[value="Favorite"]').style.display = "none";
      }

      //Checks if the resolve button is pressed, then it will try to find something with matching subject names
      document.getElementById('right-pane').querySelector('a[href="#"]').addEventListener('click', function(event)
      {
        //Find the index of the element whose subject matches the subject of the given thread
        event.preventDefault();
        var questionMatch;
        var index = 0;
        while(true)
        {
          if(currentQuestion.subject == questions[index].subject)
          {
            questionMatch = index;
            break;
          }
          if(index > questions.length)
          {
            index = -1;
            break;
          }
          index++;
        }

        //Splice it, excluding the element you just deleted
        questions.splice(index,1);
        rightPane.innerHTML = templates.renderQuestionForm();
        leftPane.innerHTML = templates.renderQuestion({'allQuestions': questions});
        storeQuestions(questions);
        updateForm(event);
        $('.list-question').parent().click(function displaySpecificThread(event)
        {
          event.preventDefault();
          var specificQuestion = this.children[0].id;
          displayQuestion(specificQuestion);
        });
      });

      //Submits the response form given that the response is accurate
      document.getElementById('response-form').addEventListener("submit", function(event)
      {
        //Check whether or not the responses are valid (first and last name and the )
        event.preventDefault();
        var nameContent = document.getElementById('response-form').querySelector('input[name="name"]').value;
        var responseContent = document.getElementById('response-form').querySelector('textarea[name="response"]').value;
        var nameContentError = document.getElementById('response-form').querySelector('label[for="Err3"]');
        var responseContentError = document.getElementById('response-form').querySelector('label[for="Err4"]');
        var passesTests = true;

        //Empty name so fail the test
        if(nameContent == "")
        {
          nameContentError.innerHTML = "You cannot have an empty name";
          passesTests = false;
        }

        //No first and last name, so it fails the test
        else if(nameContent.split(" ").length != 2)
        {
          nameContentError.innerHTML = "You must have a first and last name";
          passesTests = false;
        }

        //Works just fine, so say nothing
        else
        {
          nameContentError.innerHTML = "";
        }

        //Empty response so fail their test
        if(responseContent == "")
        {
          responseContentError.innerHTML = "You cannot have an empty response";
          passesTests = false;
        }

        //Length is not between 50 and 500 so they fail the test
        else if(responseContent.length < 50 || responseContent.length > 500)
        {
          responseContentError.innerHTML = "You must enter something between 50 and 500 chars";
          passesTests = false;
        }
        else
        {
          responseContentError.innerHTML = "";
        }

        //If they pass the test, add the response to the question thread and save it, and add the event listeners
        //again
        if(passesTests)
        {
          currentQuestion.responses.push({name: nameContent, response: responseContent});
          rightPane.innerHTML = templates.renderQuestionExp(currentQuestion);
          storeQuestions(questions);
          displayQuestion(currentQuestion.id);
        }
      });

      //If the favorite button is clicked, hide it, and make the favorite question the current one, and display the gold circle
      document.querySelector('input[value="Favorite"]').addEventListener('click', function(event)
      {
        event.preventDefault();
        document.querySelector('input[value="Favorite"]').style.display = "none";
        favoriteQuestion = currentQuestion;
      });

      //If the up or downvote is clicked, change the label with the value of the upvotes and update the currentQuestions votes
      $('.fa-chevron-up').click(function()
      {
        if(!currentQuestion.upvoted)
        {
          $('.fa-chevron-up').css('color', 'orange')
          upvoted = true;
          currentQuestion.votes++;
          currentQuestion.upvoted = true;
          $($('.fa-chevron-up').siblings()[1]).html(currentQuestion.votes);
        }
        else {
          currentQuestion.upvoted = false;
          $('.fa-chevron-up').css('color', '#337ab7');
          currentQuestion.votes--;
          $($('.fa-chevron-up').siblings()[1]).html(currentQuestion.votes);
        }
        storeQuestions(questions);
      });
    }

    //Will start a new thread and add it to the side, given the conditions are satisfied
    document.getElementById("interactors").querySelector(".btn").addEventListener('click', function startNewThread(event)
    {
      event.preventDefault();
      rightPane.innerHTML = templates.renderQuestionForm();
      updateForm(event);
    });

    //Update the left pane based on the search bar, and see if it is good
    function displayResults()
    {
        var parent = $('#submitSearch').parent();
        $('#submitSearch').remove();
        parent.append("<i id='spinningIcon' style='color: #337ab7; margin-left: 5px' class='fa fa-spinner fa-pulse'></i>");
        $('#left-pane').slideUp(function() {
        //Check if any questions's subject and question contain the search query and if it does, put
        //it in a new array and display the new array's constants
        searchedArray = [];
        allQuestions = questions;
        allQuestions.forEach(function(element, index, array)
        {
          if(element.subject.toUpperCase().indexOf(searchBox.value.toUpperCase()) != -1 ||
          element.question.toUpperCase().indexOf(searchBox.value.toUpperCase()) != -1)
          {
            searchedArray.push(element);
          }
        });
        allQuestions = searchedArray;
        leftPane.innerHTML = templates.renderQuestion({'allQuestions': allQuestions});

      //Will highlight the searched value
      //Checks if the user has entered anything (we don't want to highlight everything if they did)
      //Only goes in if the value isn't empty, or the search returned some results
      //We cannot just split and join and the whole HTML because if we did, it could affect the <h3> or <p> tag
      //which will ruin formatting. Say I searched "p", it will affect <p> tag in the innerHTML
      //so it may not be a paragraph element anymore. Splitting into the actual text material will avoid this
      if(searchBox.value != "" && searchedArray.length != 0)
      {
        //Loops through each of the subject/question objects in the left-pane
        for(var i = 0; i < leftPane.children.length; i++)
        {
          //This is split each of the subject and questions into individual texts in an array
          var subjectText = $(leftPane.children[i]).children().find('h3').html();
          var questionText = $(leftPane.children[i]).children().find('p').html();

          var subjectFragments = [];
          while(subjectText.toUpperCase().indexOf(searchBox.value.toUpperCase()) != -1)
          {
            var indexOfFirstOccurrence = subjectText.toUpperCase().indexOf(searchBox.value.toUpperCase());
            var matched = subjectText.substring(indexOfFirstOccurrence, searchBox.value.length + indexOfFirstOccurrence);
            var highlighted = "<span class= 'highlight'>" + matched + "</span>";
            var firstPart = subjectText.substring(0, indexOfFirstOccurrence);
            firstPart += highlighted;
            subjectFragments.push(firstPart);
            subjectText = subjectText.substring(searchBox.value.length + indexOfFirstOccurrence);
          }
          subjectFragments.push(subjectText);
          var questionFragments = [];
          while(questionText.toUpperCase().indexOf(searchBox.value.toUpperCase()) != -1)
          {
            var indexOfFirstOccurrence = questionText.toUpperCase().indexOf(searchBox.value.toUpperCase());
            var matched = questionText.substring(indexOfFirstOccurrence, searchBox.value.length + indexOfFirstOccurrence);
            var highlighted = "<span class= 'highlight'>" + matched + "</span>";
            var firstPart = questionText.substring(0, indexOfFirstOccurrence);
            firstPart += highlighted;
            questionFragments.push(firstPart);
            questionText = questionText.substring(searchBox.value.length + indexOfFirstOccurrence);
          }
          questionFragments.push(questionText);
          $(leftPane.children[i]).children().find('h3').html(subjectFragments.join(""));
          $(leftPane.children[i]).children().find('p').html(questionFragments.join(""));
        }
      }
      $('#left-pane').slideDown(function()
      {
        $('#spinningIcon').remove();
        parent.append("<i id='submitSearch' style='color: #337ab7; cursor: pointer; margin-left: 5px' class='fa fa-search'></i>");
      });
      $('.list-question').parent().click(function displaySpecificThread(event)
      {
        event.preventDefault();
        var specificQuestion = this.children[0].id;
        displayQuestion(specificQuestion);
      });
     });
    }
    var searchedArray = [];
    var searchBox = document.getElementById("interactors").querySelector('input[name="search"]');
    $('#submitSearch').click(function searchForSomething(event)
    {
      displayResults();
    });
    $(searchBox).change(function searchForSomething(event)
    {
      displayResults();
    });*/
    $('.btn').click(function()
    {
      $(this).blur();
    })
})(this, this.document);
