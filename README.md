> **Warning**
> _This project is no longer maintained._

# habitica-cli

An immersive command line interface for [Habitica](https://habitica.com) which features built-in emoji support, command history and tab completion!

## Demo

<img alt="Demo" src="./img/demo.gif" width="75%" />

## Introduction

Built on top of [vorpal](https://github.com/dthree/vorpal), this Habitica CLI is an interactive one that provides an array of functionality including the following:

* [x] Built-in emoji support :fire::zap:
* [x] Listing, scoring, creating, deleting habits, tasks and todos
* [x] Scoring habits, tasks and todos
* [x] Creating/Deleting habits, tasks and todos
* [x] Accessing the rewards shop and buying gear/rewards
* [x] Casting spells
* [x] Fighting bosses
* [x] Showing quest progress
* [x] Command history
* [x] Tab completion
* [x] Short aliases for power users :fire::fire:

This project was summoned with :heart: by @charlespwd.

## Getting started

### Quick start

Install `habitica-cli` on your computer:

```
npm install -g habitica-cli
```

Create a file `~/.config/habitica/auth.cfg` (you may need to create the folder(s) and file) with the following contents:

```
[Habitica]
login = USER_ID
password = API_KEY
```

Replace `USER_ID` and `API_KEY` with the corresponding tokens from [your Habitica settings>API page](https://habitica.com/#/options/settings/api).

Once that's done, all you have to do is start `habitica` from the command line:

```
$ habitica
```

Great! You're in the CLI! You can now list your tasks:

```
habitica $ habits
habitica $ dailies
habitica $ todos
```

You can also check them off:

```
habitica $ habits score 1 2 3
habitica $ habits score --down 1 2 3
habitica $ dailies complete 1 2 3
habitica $ todos complete 1 2 3
```

Or create new ones!

```
habitica $ new habit
habitica $ new todo
habitica $ new daily
```

In fact, most of the information you need on how to use any of those commands is available through the very VERY helpful `help` command.  (We're not talking Windows Help here. We're talking about a no fluff list of everything you can do and their multiple aliases).

```
habitica $ help

  Commands:

    help [command...]                    Provides help for a given command.
    exit                                 Exits application.
    status                               List your stats.
    habits list                          List your habits.
    /* ... truncated for brevity ... */

habitica $ help todos list

  Usage: todos list [options]

  Alias: todos | t

  List your todos.

  Options:

    --help                 output usage information
    -f, --filter [filter]  List filter type (all | dated | completed).

```

## User Guide

For more in-depth examples of every single commands, [you can check out the Wiki](https://github.com/charlespwd/habitica-cli/wiki)! Although it's a work in progress.

## Contributing

Help and PR's are extremely welcome :)

## License

MIT.
