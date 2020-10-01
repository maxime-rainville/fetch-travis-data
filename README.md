fetch-travis-data
=================

Fetch build data from travis. The data can be outputted as JSON or printed out

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/fetch-travis-data.svg)](https://npmjs.org/package/fetch-travis-data)
[![Downloads/week](https://img.shields.io/npm/dw/fetch-travis-data.svg)](https://npmjs.org/package/fetch-travis-data)
[![License](https://img.shields.io/npm/l/fetch-travis-data.svg)](https://github.com/maxime-rainville/fetch-travis-data/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g fetch-travis-data
$ export TRAVIS_TOKEN=<get it from https://travis-ci.org/account/preferences>
$ fetch-travis-data printFailed # prints out a list of failed builds
$ fetch-travis-data toJson # prints out a list of all builds as JSON
```

The travis token can also be provided with the `--token` parameter.
<!-- usagestop -->
# Commands
<!-- commands -->

<!-- commandsstop -->
