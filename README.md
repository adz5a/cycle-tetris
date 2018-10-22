# README

## Step 1 - A basic reactive application

The goal here is to discover how to use the tools to:

- handle user input
- use user input to act on the state of the DOM

### Handle user input

We will simply display a button which can be clicked.

CycleJS revolves around the idea of reactive programming and uses *streams* as
its main primitive to express any applicative logic.

In order to display anything in the DOM, it needs to be made available to the
framework through a *value* returned by a *stream* to a *driver*.

In our case the value vill be a *virtual node* compatible with `snabbdom`[1],
the stream will be the value returned by the `main` function as the `DOM` key
and the driver will be the official `@cycle/dom` driver which handles DOM
updates for us.


The scenario is as follow: 

- The DOM displays a counter and a button
- A ticker emits an event every second, when received this ticker increases the
  count.
- When the button is clicked, the ticker is paused. When clicked again it
  resumes.

[1] Snabbdom is a virtual dom library which allows us to model the DOM as a
value (namely virtual nodes) and express the DOM mutation as a patch operation
on these virtual nodes.
