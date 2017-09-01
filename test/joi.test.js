/* Copyright (c) 2016 Richard Rodger and other contributors, MIT License */


const Assert = require('assert');
const Lab = require('lab');
const Seneca = require('seneca');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;

const Joi = require('joi');
const JoiPlugin = require('seneca-joi');

describe('joi', () => {
  it.only('happy', (done) => {
    Seneca({ log: 'silent', legacy: { error_codes: false, validate: false } })
      .use('seneca-joi')
      .add({ a: 1, b: Joi.required() }, (msg, done) => {
        done(null, { c: 3 });
      })
      .act('a:1,b:2', function (err, out) {
        if (err) return done(err);
        Assert.equal(3, out.c);

        this.act('a:1', (err, out) => {
          Assert.equal('act_invalid_msg', err.code);
          done();
        });
      });
  });

  it('custom', (done) => {
    Seneca({ log: 'silent', legacy: { error_codes: false, validate: false } })
      .use('seneca-joi')
      .add({
        a: 1,
        joi$(schema, actmeta) {
          return schema.keys({ b: Joi.required() });
        },
      }, (msg, done) => {
        done(null, { c: 3 });
      })
      .act('a:1,b:2', function (err, out) {
        if (err) return done(err);

        Assert.equal(3, out.c);

        this.act('a:1', (err, out) => {
          Assert.equal('act_invalid_msg', err.code);
          done();
        });
      });
  });

  it('edge', (done) => {
    Seneca({ log: 'silent', legacy: { error_codes: false, validate: false } })
      .use('seneca-joi')
      .add({
        a: 1,
        joi$: 1,
      }, (msg, done) => {
        done(null, { c: 3 });
      })
      .act('a:1,b:2', (err, out) => {
        if (err) return done(err);

        Assert.equal(3, out.c);
        done();
      });
  });

  it('defensives', (done) => {
    const pmeta = JoiPlugin.preload({});
    const actmod = pmeta.extend.action_modifier;
    const actmeta = {};
    actmod(actmeta);
    Assert.equal(void 0, actmeta.validate);
    done();
  });

  it('parambulator-legacy', (done) => {
    Seneca({ log: 'silent', legacy: { error_codes: false, validate: false } })
      .use('seneca-joi', { legacy: true })
      .add({
        a: 0,
      }, (msg, done) => {
        done(null, { c: 0 });
      })
      .add({
        a: 1,
        b: { required$: true },
      }, (msg, done) => {
        done(null, { c: 1 });
      })
      .add({
        a: 2,
        b: { d: { string$: true } },
      }, (msg, done) => {
        done(null, { c: 2 });
      })
      .add({
        a: 3,
        b: { e: 'required$' },
      }, (msg, done) => {
        done(null, { c: 3 });
      })
      .act('a:0', function (err, out) {
        if (err) return done(err);
        Assert.equal(0, out.c);

        this.act('a:1,x:1', function (err, out) {
          if (err) return done(err);
          Assert.equal(1, out.c);

          this.act('a:2,b:1', function (err, out) {
            if (err) return done(err);
            Assert.equal(2, out.c);

            this.act('a:3,b:1', (err, out) => {
              if (err) return done(err);
              Assert.equal(3, out.c);

              legacy_false();
            });
          });
        });
      });

    function legacy_false() {
      Seneca({ log: 'silent', legacy: { error_codes: false, validate: false } })
        .use('seneca-joi', { legacy: false })
        .add({
          a: 0,
        }, (msg, done) => {
          done(null, { c: 0 });
        })
        .add({
          a: 1,
          b: { c: 2 },
        }, (msg, done) => {
          done(null, { c: 1 });
        })
        .act('a:0,b:1', function (err, out) {
          if (err) return done(err);
          Assert.equal(0, out.c);

          this.act('a:1,b:{c:2}', function (err, out) {
            if (err) return done(err);
            Assert.equal(1, out.c);

            this.act('a:1,b:2', (err, out) => {
              Assert.equal('act_invalid_msg', err.code);
              done();
            });
          });
        });
    }
  });

  it.skip('parambulator-legacy test default value seneca > 3.x', (done) => {
    const si = Seneca({ log: 'silent', legacy: { error_codes: false, validate: false } });
    if (si.version < '3.0.0') {
      return done();
    }

    si.use('seneca-joi');
    si.ready(() => {
      si.add({
        a: 2,
        b: { d: { string$: true } },
      }, (msg, done) => {
        done(null, { c: 2 });
      });

      si.act('a:2,b:1', (err, out) => {
        Assert.equal('act_invalid_msg', err.code);

        done();
      });
    });
  });

  it('is_parambulator', (done) => {
    Assert.ok(JoiPlugin._test$.is_parambulator({
      empty: null,
      use: {},
      config: { object$: true },
      plugin: { string$: true } }));

    Assert.ok(!JoiPlugin._test$.is_parambulator(
      { a: { b: { c: { d: { e: { f: { g: { h: { i: { j: { k: { l: 1 } } } } } } } } } } } }));

    done();
  });
});
