# habitica-cli

A pleasant habitica command line interface which features built-in emoji support, command history and tab completion!

## Demo

<img alt="Demo" src="./img/demo.gif" width="75%" />

## Features

* Built-in emoji support :fire: :zap:
* Listing habits, tasks and todos
* Scoring habits, tasks and todos
* Command history
* Tab completion

## Install

```
npm install -g habitica-cli
```

## Configure

You'll need to let the tool know how to connect to your Habitica account. To do this, you'll need to add the following credentials section in the file `~/.config/habitica/auth.cfg` (you may need to create the folder(s) and file):

```
[Habitica]
login = USER_ID
password = API_KEY
```

Replace `USER_ID` and `API_KEY` with the corresponding tokens from [your Habitica settings>API page](https://habitica.com/#/options/settings/api).

Lastly, remember to `chmod 600 ~/.config/habitica/auth.cfg` to keep your credentials secret.

## User guide

## License

MIT.
