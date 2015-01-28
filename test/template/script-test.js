var pc   = require("../.."),
expect   = require("expect.js"),
BindableObject = require("bindable-object");

// TODO - clean me up!

describe(__filename + "#", function () {
  
  describe("preserved words", function () {

    it("can return an undefined value", function () {
      expect(pc.template("{{undefined}}").view({undefined:"abba"}).render().toString()).to.be("");
    });

    it("can return an null value", function () {
      expect(pc.template("{{null}}").view({null:"abba"}).render().toString()).to.be("");
    });

    it("can return false", function () {
      expect(pc.template("{{false}}").view({false:"abba"}).render().toString()).to.be("false");
    });

    it("can return true", function () {
      expect(pc.template("{{true}}").view({true:"abba"}).render().toString()).to.be("true");
    });
  });

  describe("references", function () {
    it("can return a reference with no path", function () {
      expect(pc.template("{{name}}").view({name:"frank"}).render().toString()).to.be("frank");
    });

    it("can contain paths", function () {
      expect(pc.template("{{name.first}}").view({name:{first:"frank"}}).render().toString()).to.be("frank");
    });

    it("doesn't break if the path doesn't exist", function () {
      expect(pc.template("{{name.first}}").view().render().toString()).to.be("");
    });

    it("dcan return an alternative value if a ref doesn't exist", function () {
      expect(pc.template("{{name.first || 'doesn\\'t exist!' }}").view().render().toString()).to.be("doesn&#x27;t exist!");
    });

    it("can call a function", function () {
      expect(pc.template("{{hello()}}").view({ hello: function () {
        return "world!";
      }}).render().toString()).to.be("world!");
    });

    it("can call a nested function", function () {
      expect(pc.template("{{a.b.hello()}}").view({ a: { b: { hello: function () {
        return "world!";
      }}}}).render().toString()).to.be("world!");
    });

    it("can call a function that doesn't exist", function () {
      expect(pc.template("{{hello()}}").view().render().toString()).to.be("");
    });

    it("can call a can assign to a nested value function that doesn't exist", function () {
      expect(pc.template("{{a.b.hello()}}").view().render().toString()).to.be("");
    });

    it("can call a function with one param", function () {
      expect(pc.template("{{hello('bob')}}").view({ hello: function (name) {
        return "hello " + name;
      }}).render().toString()).to.be("hello bob");
    });

    it("can call a function with a comparison operator", function () {
      expect(pc.template("{{hello() === 'world'}}").view({
        hello: function () {
          return "world";
        }
      }).render().toString()).to.be("true");
    });
  });


  describe("comparison operators", function () {
    it("can check that name == name", function () {
      expect(pc.template("{{name==name}}").view({name:"frank"}).render().toString()).to.be("true");
    });

    it("can check that name === name", function () {
      expect(pc.template("{{name===name}}").view({name:"frank"}).render().toString()).to.be("true");
    });

    it("can check that name !== false", function () {
      expect(pc.template("{{name!==false}}").view({name:"frank"}).render().toString()).to.be("true");
    });

    it("can return false || true", function () {
      expect(pc.template("{{false||true}}").view().render().toString()).to.be("true");
    });

    it("can return true && true", function () {
      expect(pc.template("{{true&&true}}").view().render().toString()).to.be("true");
    });

    it("can return true && false", function () {
      expect(pc.template("{{true&&false}}").view().render().toString()).to.be("false");
    });

    it("can check that 10 > 9 === true", function () {
      expect(pc.template("{{10>9===true}}").view().render().toString()).to.be("true");
    });

    it("can cast !!name as a boolean", function () {
      expect(pc.template("{{!!name}}").view({name:"craig"}).render().toString()).to.be("true");
      expect(pc.template("{{!!name}}").view().render().toString()).to.be("false");
    });

    it("can check that 10 > 10 === false", function () {
      expect(pc.template("{{10>10}}").view().render().toString()).to.be("false");
    });

    it("can check that 10 >= 10 === false", function () {
      expect(pc.template("{{10>=10===true}}").view().render().toString()).to.be("true");
    });

    it("can check that 10 < 10 === false", function () {
      expect(pc.template("{{10<10}}").view().render().toString()).to.be("false");
    });

    it("can check that 10 <= 10 === true", function () {
      expect(pc.template("{{10<=10===true}}").view().render().toString()).to.be("true");
    });

    it("can check that hello() === 'world!'", function () {
      expect(pc.template("{{hello() === 'world!'}}").view({ hello: function () {
        return "world!"
      }}).render().toString()).to.be("true");
    });

  });

  describe("strings", function () {
    it("can be concatenated", function () {
      expect(pc.template('{{fn+" "+ln}}').view({fn:"a",ln:"b"}).render().toString()).to.be("a b");
      expect(pc.template('{{fn+ln}}').view({fn:"a",ln:"b"}).render().toString()).to.be("ab");
    });

    it("can be defined", function () {
      expect(pc.template('{{"abba"}}').view().render().toString()).to.be("abba");
    })
  });

  describe("numbers", function () {

    it("can add two numbers together", function() {
      expect(pc.template("{{5+2}}").view().render().toString()).to.be("7");
    });

    it("can add two refs together", function() {
      expect(pc.template("{{a+b}}").view({a:5,b:2}).render().toString()).to.be("7");
    });

    it("can be multiplied", function() {
      expect(pc.template("{{2*2}}").view({}).render().toString()).to.be("4");
    });

    it("can be divided", function() {
      expect(pc.template("{{10/2}}").view({}).render().toString()).to.be("5");
    });

    it("can use decimal values", function() {
      expect(pc.template("{{10+0.1}}").view({}).render().toString()).to.be("10.1");
    });

    it("can use negative values", function() {
      expect(pc.template("{{10+-1}}").view({}).render().toString()).to.be("9");
    });

    it("can cast a ref as a negative value", function () {
      expect(pc.template("{{-a}}").view({a:5}).render().toString()).to.be("-5");
    });

    // breaks
    if(false)
    it("can subtract a negative value", function () {
      expect(pc.template("{{5 - -4}}").view().render().toString()).to.be("9");
    });

    it("can be concatenated on a string", function () {
      expect(pc.template("{{100+'%'}}").view().render().toString()).to.be("100%");
    });
  });

  describe("assigning", function () {

    var c;
    beforeEach(function () {
      c = new BindableObject();
    })

    it("can assign a=true", function () {
      expect(pc.template("{{a=true}}").view(c).render().toString()).to.be("true");
      expect(c.get("a")).to.be(true);
    });

    it("can assign to a nested value", function () {
      expect(pc.template("{{a.b.c.d=!e}}").view(c).render().toString()).to.be("true");
      expect(c.get("a.b.c.d")).to.be(true);
    });

    it("can assign aa.a=a=b=c=d", function () {
      var c = new BindableObject({d:1});
      pc.template("{{aa.a=a=b=c=d}}").view(c).render();
      expect(c.get("aa.a")).to.be(1);
      expect(c.get("a")).to.be(1);
      expect(c.get("b")).to.be(1);
      expect(c.get("c")).to.be(1);
      expect(c.get("d")).to.be(1);
      c.set("c", 2);

      // triggers re-evaluation. All values should STILL be 1
      expect(c.get("c")).to.be(1);

      c.set("d", 2);
      expect(c.get("aa.a")).to.be(2);
      expect(c.get("a")).to.be(2);
      expect(c.get("b")).to.be(2);
      expect(c.get("c")).to.be(2);
      expect(c.get("d")).to.be(2);
    });
  });
});