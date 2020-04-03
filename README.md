# PointersInC
A site that help students understand how pointers work. Available at <a href = "https://arturo32.github.io">arturo32.github.io</a>.

## Objective
To be a site that shows how pointers work through a representation of the computer memory. This memory would show the names, addresses and contents of the variables and change as the user creates new variables in their code, instantly. The pointers also would have arrows coming out of them and pointing to the variables that they point to.

## What has been done
The site can currently recognize, through ReGex in JavaScript, normal variables and pointers, instantly, as the user types in a text box, and show their types, names and "contents" in a HTML table element, as shown bellow:

![image 1](https://github.com/arturo32/arturo32.github.io/blob/master/images/example_1.png)

Notice that the "content" of pointers are the names of the variables that they are pointing to, instead of their actual content: addresses of variables. That's okay for now, it's just to see if I can recognize what comes after a declaration. Also, declarations and initializations can be done separately and the code will also recognize and link them. Dereferencing a pointer and assigning it a value now is recognized too.

The site, as a bonus, also have an online compiler with an input and output boxes that works through an API provided by https://paiza.io/en. In their site they say that the API service is not guaranteed at all but it seems that I am allowed to use it for non-commercial purposes (their <a href="https://paiza.jp/guide/kiyaku">terms of service</a> are only in Japanese). I really should seek another API from another site. If you know one, please, let me know. 

## How it works
Regular expressions. Lots of them. <br/>
Each time the user types enter, semicolon or pastes something in the text box, a function is called (in the HMTL code) to search for pointers and regular variables using RegEx. If found, more functions, with more RegEx, are called to separate the type, name and content of the variables and put them into two arrays of objects: one of regular variables and other of pointers. <br/>
Both have elements with three properties but the "content" of pointer, instead of being an integer or a string, is an object of the type regularVariable. It receives a reference of an existing variable to be able to modify it: when a pointer is dereferenced, for example, the pointer can easily access the variable that it is pointing to and change its value. <br/>
After all that, the arrays are send to a function that manipulates the DOM to put the their elements in a HTML table element. In the end, this table is added as a child of the empty div "outputPtr".

### Compiler API
All the API documentation is <a href = "http://api.paiza.io/docs/swagger/#!/runners/" >here</a>. As it is not very friendly with first time users of APIs (like me!), I will explain with details how I work with it. <br/>
The moment that the user clicks the button "Compilar e executar" a POST request is sent, using JQuery, to https://api.paiza.io/runners/create, with three important attributes in its body: the "source_code" with all the code made by the user, the "language", in this case, C (the API can support 31 programming languages), and the input text that the user may or may not have typed in the input box. From the response of this request is collected an ID for the API know who I am in the next request. <br/>
The next step is to send a GET request to the same link, with a change at the end (is /get_details instead of /create). This GET request is sent with the ID presented earlier. The first thing to do with the response is to check the "status" parameter, as it will tell if the compilation have finished in the API server. If is not the case, the function calls itself after 100 milliseconds, until the "status" parameter shows that they have completed the compilation. <br/>
The second thing to check is the errors parameters! There are two: "build_stderr" (indicates errors in compilation) and "result" (indicates errors in execution). The first comes with its own message error but the second just indicates "failure", so in this case the "exit_code" must be checked to know what kind of error have happened (with a number code). If any of this errors happens, the message is showed in the output box of the site. If none of them happen, then the content of the "stdout" parameter is showed in the output box.


## What will be done
* Identify pointer dereferencing, to know when to change the content of variables;
* Identify assignment of variables with another variables;
* Identify and apply arithmetic operators with numbers, variables and assignments (e.g. +=, \*=);
* Identify and apply the increment operator for both regular variables and pointers; 
* Designing the representation of memory and apply it with CSS/JavaScript;
* Identify arrays;
* Use a "diff algorithm" for a faster experience in big codes (?).

