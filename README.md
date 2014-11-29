# dash-web

> The AngularJS app part of [Dash](https://github.com/kyukyukyu/dash)

## Quickstart

First, clone this repository.

```shell
git clone https://github.com/kyukyukyu/dash-web.git
cd dash-web
```

Then, make sure [Bower](http://bower.io) and
[Grunt](http://gruntjs.com) installed. If not, run the
following command to install them.

```shell
npm install -g bower grunt-cli
```

Also, make sure [Compass](http://compass-style.org) installed.
This one is needed to compile [SASS](http://sass-lang.com) files.

```shell
gem install compass
```

Next, install dependencies.

```shell
npm install && bower install
```

Now you are ready to play with dash-web!

## Testing

dash-web uses [Karma](http://karma-runner.github.io/)
as test runner, [Jasmine
2.0](http://jasmine.github.io/2.0/introduction.html) as
unit testing framework, and
[Protractor](http://angular.github.io/protractor/) as
E2E testing framework. Also, to mock HTTP backends,
which should be implemented in
[Dash](https://github.com/kyukyukyu/dash),
[protractor-http-mock](https://github.com/atecarlos/protractor-http-mock)
is used.

Below is the directory structure for tests.

```
test/
  e2e/
    mock/     # HTTP backend mocks are here.
    spec/     # E2E testing specs are here.
  mock/       # Fixture data for HTTP backend mocks are here.
  spec/       # Unit testing specs are here.
    controllers/
    services/
  .jshintrc   # for test codes
  karma.conf.js       # Karma configuration
  protractor-e2e.js   # Protractor configuration
```

To run the tests, just run the following command on the root directory.

```shell
grunt test
```

## Serving the App

This app can be served on ``http://localhost:9000/``
with Grunt server. Just run the following command. This
will serve the app forever until you terminate the
process, and watch the changes on the files so that the
browser reloads the page or tests are run immediately.

```shell
grunt serve
```

## Build

Run the following command, and the generated files from
the build will be located at ``dist`` directory.

```shell
grunt build
```

If you want to do ``jshint``, testing, and build at
once, just run ``grunt``. If you want to run the server
with generate files, run ``grunt serve:dist``.
