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
Regular expression. Lots of it. More details soon.

## What will be done
I have to make pointer dereferencing works, to know when to change the content of variables. Besides that I can only think in designing the representation of memory and apply it with CSS/JavaScript.
