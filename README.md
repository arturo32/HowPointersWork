> *Este arquivo README também está disponível em português brasileiro. Clique em `README(pt-br).md` nos arquivos acima para lê-lo.*


# How\*PointersWork
A site that help students understand how pointers work. Available at <a href = "https://arturo32.github.io/HowPointersWork/">arturo32.github.io/HowPointersWork</a>.

<a href="https://github.com/arturo32/HowPointersWork-server">Click here to go to the backend repository</a>.

<p align="center">
<img src="./images/main.png"
   alt="Screenshot of the site: code editor on the left, in the right a representation of a computer's memory is showing the variables and pointers in two columns: stack and heap."/>
</p>

## Objective
To help students understand pointers in the C and C++ programming languages through a visual representation of the computer memory.


## Running with docker 

```bash
sudo docker build -f Dockerfile -t hpw-front .
sudo docker run -p 8080:8080 -it hpw-front #detached: sudo docker run -d -p 8080:8080 hpw-front
```

## TODO

- Avoid new local variables appear between pre-existing cells (do some math to calculate space between cells, taking into account their type. ex.: how could it be 8 bytes between two "ints"? there is a hiding cell between them!);
- Improve accessibility
    - How to "show" arrows to assistive technologies?;
    - Notify assistive technologies of changes in memory (aria-live?);
    - "Show" highlighted line to assistive technologies in execution mode;
- Add levels of abstraction (one showing/ommiting memory addresses, other showing the values in binary, hiding the stack-heap separation);
- Show pedagogical text when clicking in some parts of the visualization;
- Improve visualization of long arrays;
- Improve visualization of C++'s pass by reference parameters (ex.: void fun(int &x)). Currently they are shown as pointers;
- Add visualization for global variables;

*Icons from [reshot](https://www.reshot.com)
