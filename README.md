> *Este arquivo README também está disponível em português brasileiro. Clique em `README(pt-br).md` nos arquivos acima para lê-lo.*


# How\*PointersWork
A site that help students understand how pointers work. Available at <a href = "https://arturo32.github.io/HowPointersWork/">arturo32.github.io/HowPointersWork</a>.

<p align="center">
<img src="./images/main.png"
   alt="Screenshot of the site: code editor on the left, in the right a representation of a computer's memory is showing the variables and pointers in two columns: stack and heap."/>
</p>

## Objective
To help students understand pointers in the C programming language through a visual representation of the computer memory, which changes as the user types its code.


## What will be done
* Show pedagogical text when clicking in some parts of the visualization;


## Docker 

```bash
docker build -f Dockerfile -t hpw-front .
docker run -p 8080:8080  -it hpw-front
```

*Icons from [reshot](https://www.reshot.com)
