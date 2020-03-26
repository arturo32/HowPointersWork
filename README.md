# PointersInC
A site that help students understand how pointers work.

## Objective
To be a site that shows how pointers work through a representation of the computer memory. This memory would show the names, addresses and contents of the variables and change as the user creates new variables in their code, instantly. The pointers also would have arrows coming out of them and pointing to the variables that they point to.

## What has been done
The site can currently recognize, through regex in JavaScript, normal variables and pointers, instantly, as the user types in a text box, and show their types, names and "contents" in a HTML table element, as shown bellow:

![image 1](https://github.com/arturo32/arturo32.github.io/blob/master/exemple.png)

Notice that the "content" of pointers are the names of the variables that they are pointing to, instead of their actual content: addresses of variables. That's okay for now, it's just to see if I can recognize what comes after a declaration. Also, declarations and initializations can be done separately and the code will also recognize and link them.

The site, as a bonus, also have an online compiler with an input and output boxes that works through an API provided by https://paiza.io/en. In their site they say that the API service is not guaranteed at all but it seems that I am allowed to use it for non-commercial purposes (their <a href="https://paiza.jp/guide/kiyaku">terms of service</a> are only in Japanese). I really should seek another API from another site. If you know one, please, let me know. 

## How it works
[soon]

## What will be done
Right now I am working on linking the variable, that the pointer points to, to the pointer itself. Because the code can only see the words that came after a pointer initialization but don't connect the pointer to the elements in the variables names list (or to another pointer in the pointers names list).

Next will be the design of the representation of memory.