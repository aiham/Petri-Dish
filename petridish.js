(function (window) {

  // JSLint settings
  // browser: true, maxerr: 50, indent: 2
  'use strict';

  var $ = window.jQuery,

    gyudon = window.gyudon,

    PetriDish,
    
    randomInt = function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    timeToCoords = function (start) {
      var time = start - Math.floor(start / 12) * 12,
        angle = time * 30 / 180 * Math.PI;
      return new gyudon.Coord(gyudon.Math.cos(angle), gyudon.Math.sin(angle));
    };

  PetriDish = function (container) {

    this.pattern = 'random';
    this.circle_style = 'fill';
    this.red = 0;
    this.blue = 0;
    this.green = 0;
    this.scale = 0;
    this.radius = 248;
    this.colour_spacer = 45;

    this.c = new gyudon.Manager(500, 500);
    container.append(this.c.e);
    container = null;
    this.c.start();

    this.border_circle = new gyudon.Item.Circle({
      tag: 'border',
      stroke: '#cccccc',
      center: new gyudon.Coord(this.c.width / 2, this.c.height / 2),
      radius: this.radius
    });
    this.c.addItem(this.border_circle);

    gyudon.Timer.add(this, function (callback) {
      this.patterns[this.pattern].call(this, callback);
    });

  };

  PetriDish.prototype = {

    constructor: PetriDish,

    setPattern: function (pattern) {

      gyudon.Timer.stop();

      this.c.canvas.clear();
      this.c.removeAllItems().
        addItem(this.border_circle);

      this.pattern = pattern;
      this.red = 0;
      this.blue = 0;
      this.green = 0;
      this.scale = 0;

      gyudon.Timer.step();

      return this;

    },

    setStyleWireframe: function () {
      this.circle_style = 'stroke';
    },

    setStyleFilled: function () {
      this.circle_style = 'fill';
    },

    pulse: function (options) {

      var colour, target, circle, circle_options, key,
        defaults = {
          time: randomInt(0, 1200) / 100,
          red: randomInt(0, 255),
          green: randomInt(0, 255),
          blue: randomInt(0, 255),
          radius: 20,
          center: new gyudon.Coord(this.c.width / 2, this.c.height / 2),
          speed: 1000
        };

      options = options || {};

      for (key in defaults) {
        if (defaults.hasOwnProperty(key) && !options.hasOwnProperty(key)) {
          options[key] = defaults[key];
        }
      }

      if (options.speed < 100) {
        options.speed = 100;
      }

      colour = 'rgb(' + options.red + ', ' + options.green + ', ' + options.blue + ')';
      target = timeToCoords(options.time);
      target.x = target.x * this.radius + this.c.width / 2 - options.radius;
      target.y = target.y * this.radius + this.c.height / 2 - options.radius;

      circle_options = {
        tag: 'circle',
        center: options.center,
        radius: options.radius,
        alpha: 0
      };
      circle_options[this.circle_style] = colour;

      circle = new gyudon.Item.Circle(circle_options);
      this.c.addItem(circle);

      circle.moveTo(options.speed, target).
        fadeIn(options.speed / 2 - 50, function () {
          this.fadeOut(options.speed / 2 - 50, function () {
            this.removeFromParent().destroy();
          });
        });

    },

    patterns: {

      random: function () {
        this.pulse();
      },

      full_random: function () {
        var z;
        for (z = 0; z < 7; z += 1) {
          this.pulse();
        }
      },

      small_random: function () {
        var z;

        for (z = 0; z < 7; z += 1) {
          this.pulse({radius: 5});
        }
      },

      red_random: function () {
        this.pulse({
          red: this.red,
          blue: this.blue,
          green: this.green
        });

        this.red += 10;
        if (this.red > 255) {
          this.red = 0;
        }
      },

      blue_random: function () {
        this.pulse({
          red: this.red,
          blue: this.blue,
          green: this.green
        });

        this.blue += 10;
        if (this.blue > 255) {
          this.blue = 0;
        }
      },

      green_random: function () {
        this.pulse({
          red: this.red,
          blue: this.blue,
          green: this.green
        });

        this.green += 10;
        if (this.green > 255) {
          this.green = 0;
        }
      },

      ray_gun: function (callback) {
        var z;
        if (callback.count % 2 !== 0) {
          return;
        }
        for (z = 0; z < 12; z += 1) {
          this.pulse({
            time: z,
            red: this.red,
            blue: this.blue,
            green: this.green
          });
        }
        this.red += this.colour_spacer;
        if (this.red > 255) {
          this.red = 0;
          this.blue += this.colour_spacer;
          if (this.blue > 255) {
            this.blue = 0;
            this.green += this.colour_spacer;
            if (this.green > 255) {
              this.green = 0;
            }
          }
        }
      },

      slow_ray_gun: function (callback) {
        var z;
        if (callback.count % 10 !== 0) {
          return;
        }
        for (z = 0; z < 12; z += 1) {
          this.pulse({
            time: z,
            red: this.red,
            blue: this.blue,
            green: this.green,
            speed: 3000
          });
        }
        this.red += this.colour_spacer;
        if (this.red > 255) {
          this.red = 0;
          this.blue += this.colour_spacer;
          if (this.blue > 255) {
            this.blue = 0;
            this.green += this.colour_spacer;
            if (this.green > 255) {
              this.green = 0;
            }
          }
        }
      },

      random_ray_gun: function (callback) {
        var z;
        if (callback.count % 2 !== 0) {
          return;
        }
        for (z = 0; z < 12; z += 1) {
          this.pulse({time: z});
        }
      },

      take_over: function (callback) {
        var z;
        if (callback.count % 10 !== 0) {
          return;
        }
        for (z = 0; z < 12; z += 1) {
          this.pulse({
            time: z,
            red: this.red,
            blue: this.blue,
            green: this.green,
            radius: this.scale * 5,
            speed: 3000
          });
        }
        this.scale += 1;
        if (this.scale > 50) {
          this.scale = 0;
        }
        this.red += this.colour_spacer + 20;
        if (this.red > 255) {
          this.red = 0;
          this.blue += this.colour_spacer + 20;
          if (this.blue > 255) {
            this.blue = 0;
            this.green += this.colour_spacer + 20;
            if (this.green > 255) {
              this.green = 0;
            }
          }
        }
      },

      spiral: function () {
        this.pulse({
          time: this.scale,
          red: this.red,
          blue: this.blue,
          green: this.green
        });
        this.scale += 1;
        if (this.scale >= 12) {
          this.scale = 0;
        }
        this.red += this.colour_spacer;
        if (this.red > 255) {
          this.red = 0;
          this.blue += this.colour_spacer;
          if (this.blue > 255) {
            this.blue = 0;
            this.green += this.colour_spacer;
            if (this.green > 255) {
              this.green = 0;
            }
          }
        }
      },

      random_spiral: function () {
        this.pulse({time: this.scale});
        this.scale += 1;
        if (this.scale >= 12) {
          this.scale = 0;
        }
      },

      sprinkler: function (callback) {
        var target, z;

        if (callback.count % 2 !== 0) {
          return;
        }
        target = timeToCoords(this.scale);
        target.x = target.x * (this.radius - 30) + this.c.width / 2;
        target.y = target.y * (this.radius - 30) + this.c.height / 2;
        for (z = 0; z < 12; z += 1) {
          if (z !== this.scale) {
            this.pulse({
              time: z + 1,
              center: new gyudon.Coord(target.x, target.y)
            });
          }
        }
        this.scale += 1;
        if (this.scale >= 12) {
          this.scale = 0;
        }
      }

    }

  };

  $(window.document).ready(function () {

    var petridish, stroke_input, fill_input, menu, circle_type_action,
      pattern, name, button, about_button, report_button, pattern_setter;
  
    $('.js_only').removeClass('js_only');

    petridish = new PetriDish($('#main'));
    
    stroke_input = $('#stroke');
    fill_input = $('#fill');
    menu = $('#menu');

    fill_input.attr('checked', 'checked');
    
    circle_type_action = function () {
      if ($('input[@name=circle_type]:checked').attr('id') === 'stroke') {
        petridish.setStyleWireframe();
      } else {
        petridish.setStyleFilled();
      }
    };
    
    stroke_input.click(circle_type_action);
    fill_input.click(circle_type_action);

    pattern_setter = function (pattern) {
      return function (e) {
        petridish.setPattern(pattern);
        e.preventDefault();
      };
    };

    for (pattern in petridish.patterns) {
      if (petridish.patterns.hasOwnProperty(pattern)) {
        name = pattern.replace(/_/g, ' ');
        name = name.charAt(0).toUpperCase() + name.slice(1);
        menu.append($('<li>').
          append(
            $('<a>').attr('href', '#').
              click(pattern_setter(pattern)).
              text(name)
          ).
          addClass('option'));
      }
    }

    button = $('#menu li.button a');
    button.click(function (e) {
      if (!button.hasClass('hidden')) {
        button.addClass('hidden');
        $('#menu li.option').stop(true, true).slideUp('foobar', 'swing');
      } else {
        button.removeClass('hidden');
        $('#menu li.option').stop(true, true).slideDown('foobar', 'swing');
      }
      e.preventDefault();
    });
    
    about_button = $('#about li.button a');
    about_button.click(function (e) {
      if (!about_button.hasClass('hidden')) {
        about_button.addClass('hidden');
        $('#about li.info').stop(true, true).slideUp('foobar', 'swing');
      } else {
        about_button.removeClass('hidden');
        $('#about li.info').stop(true, true).slideDown('foobar', 'swing');
      }
      e.preventDefault();
    }).click();
    
    report_button = $('a.report_link');
    report_button.click(function (e) {
      e.preventDefault();
      if ($('#report_box').length > 0) {
        return;
      }
      $('#report_container').append(
        $('<form>').hide().
          attr('id', 'report_box').
          submit(function (e) {
            var report_details = $('#report_details').val();
            e.preventDefault();
            $('#report_close').click();
            if (report_details.length > 0) {
              $.ajax({
                data: {details: report_details},
                type: 'POST',
                url: 'report.php'
              });
              $.notifyBar({
                html: 'Thank you for reporting this problem. ' +
                  'It will be investigated as soon as possible.',
                close: true
              });
            }
          }).
          html(
            '<p>Please describe the problem you encountered.</p>' +
              '<div><textarea id="report_details"></textarea></div>' +
              '<div><input type="submit" value="Report">' + 
              '<p><a href="#" id="report_close">Close</a></p></div>'
          )
      );
      $('#report_close').click(function (e) {
        e.preventDefault();
        $('#report_box').hide('foobar', function () {
          $(this).remove();
        });
      });
      $('#report_box').show('foobar');
    });
  
  });

}(window));
