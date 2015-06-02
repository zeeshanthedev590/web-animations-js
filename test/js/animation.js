suite('animation', function() {
  setup(function() {
    webAnimations1.timeline._animations = [];
  });
  test('zero duration animation works', function() {
    tick(90);
    var a = document.body.animate([], 0);
    tick(100);
    assert.equal(a.startTime, 100);
    assert.equal(a.currentTime, 0);
  });
  test('playing works as expected', function() {
    tick(90);
    var a = document.body.animate([], 2000);
    tick(100);
    assert.equal(a.startTime, 100);
    assert.equal(a.currentTime, 0);
    tick(300);
    assert.equal(a.startTime, 100);
    assert.equal(a.currentTime, 200);
  });
  test('pause at start of play', function() {
    tick(90);
    var a = document.body.animate([], 2000);
    a.pause();
    tick(100);
    assert.equal(a.currentTime, 0);
    tick(300);
    a.play();
    assert.equal(a.currentTime, 0);
    tick(310);
    assert.equal(a.currentTime, 0);
    assert.equal(a.startTime, 310);

    var a = document.body.animate([], 2000);
    a.startTime = -690;
    a.pause();
    assert.equal(a.currentTime, null);
    tick(700);
    a.play();
    tick(701);
    assert.equal(a.currentTime, 1000);
    tick(800);
    assert.equal(a.currentTime, 1099);
    assert.equal(a.startTime, -299);
  });
  test('pausing works as expected', function() {
    tick(190);
    var a = document.body.animate([], 3000);
    tick(200);
    tick(1500);
    assert.equal(a.startTime, 200);
    assert.equal(a.currentTime, 1300);
    a.pause();
    assert.equal(a.startTime, null);
    assert.equal(a.currentTime, null);
    tick(2500);
    assert.equal(a.startTime, null);
    assert.equal(a.currentTime, 1300);
    a.play();
    tick(2510);
    assert.equal(a.startTime, 1210);
    assert.equal(a.currentTime, 1300);
    tick(3500);
    assert.equal(a.startTime, 1210);
    assert.equal(a.currentTime, 2290);
  });
  test('reversing works as expected', function() {
    tick(290);
    var a = document.body.animate([], 1000);
    tick(300);
    assert.equal(a.startTime, 300);
    assert.equal(a.currentTime, 0);
    tick(600);
    assert.equal(a.startTime, 300);
    assert.equal(a.currentTime, 300);
    assert.equal(a.playbackRate, 1);
    a.reverse();
    tick(600);
    assert.equal(a.startTime, 900);
    assert.equal(a.currentTime, 300);
    assert.equal(a.playbackRate, -1);
    tick(700);
    assert.equal(a.startTime, 900);
    assert.equal(a.currentTime, 200);
  });
  test('reversing after pausing', function() {
    tick(90);
    var a = document.body.animate([], 1000);
    tick(100);
    tick(600);
    a.reverse();
    tick(601);
    tick(700);
    assert.equal(a.startTime, 1101);
    assert.equal(a.currentTime, 401);
  });
  test('reversing after finishing works as expected', function() {
    tick(90);
    var a = document.body.animate([], 1000);
    tick(100);
    tick(1200);
    assert.equal(a.finished, true);
    assert.equal(a.startTime, 100);
    assert.equal(a.currentTime, 1000);
    tick(1500);
    assert.equal(a.currentTime, 1000);
    assert.equal(isTicking(), false);
    a.reverse();
    assert.equal(a._startTime, null);
    assert.equal(a.currentTime, 1000);
    tick(1600);
    assert.equal(a.startTime, 2600);
    assert.equal(a.currentTime, 1000);
  });
  test('playing after finishing works as expected', function() {
    tick(90);
    var a = document.body.animate([], 1000);
    tick(100);
    tick(1200);
    assert.equal(a.finished, true);
    assert.equal(a.startTime, 100);
    assert.equal(a.currentTime, 1000);
    tick(1500);
    assert.equal(a.currentTime, 1000);
    assert.equal(isTicking(), false);
    a.play();
    assert.equal(a.startTime, null);
    assert.equal(a.currentTime, 0);
    tick(1600);
    assert.equal(a.startTime, 1600);
    assert.equal(a.currentTime, 0);
  });
  test('limiting works as expected', function() {
    tick(390);
    var a = document.body.animate([], 1000);
    tick(400);
    assert.equal(a.startTime, 400);
    assert.equal(a.currentTime, 0);
    tick(900);
    assert.equal(a.startTime, 400);
    assert.equal(a.currentTime, 500);
    tick(1400);
    assert.equal(a.startTime, 400);
    assert.equal(a.currentTime, 1000);
    tick(1500);
    assert.equal(a.startTime, 400);
    assert.equal(a.currentTime, 1000);
    a.reverse();
    assert.equal(a.playbackRate, -1);
    assert.equal(a.currentTime, 1000);
    assert.equal(a._startTime, null);
    tick(2000);
    assert.equal(a.currentTime, 1000);
    assert.equal(a.startTime, 3000);
    tick(2200);
    assert.equal(a.currentTime, 800);
    assert.equal(a.startTime, 3000);
    tick(3200);
    assert.equal(a.currentTime, 0);
    assert.equal(a.startTime, 3000);
    tick(3500);
    assert.equal(a.currentTime, 0);
    assert.equal(a.startTime, 3000);
  });
  test('play after limit works as expected', function() {
    tick(490);
    var a = document.body.animate([], 2000);
    tick(500);
    tick(2600);
    assert.equal(a.currentTime, 2000);
    assert.equal(a.startTime, 500);
    assert.equal(a.finished, true);
    assert.equal(a.playbackRate, 1);
    setTicking(true);
    a.play();
    tick(2700);
    assert.equal(a.startTime, 2700);
    assert.equal(a.currentTime, 0);
    assert.equal(a.finished, false);
    assert.equal(a.playbackRate, 1);
  });
  test('play after limit works as expected (reversed)', function() {
    tick(590);
    var a = document.body.animate([], 3000);
    tick(600);
    tick(700);
    a.reverse();
    tick(701);
    tick(900);
    assert.equal(a.startTime, 801);
    assert.equal(a.currentTime, 0);
    assert.equal(a.finished, true);
    assert.equal(a.playbackRate, -1);
    setTicking(true);
    a.play();
    tick(1000);
    assert.equal(a.startTime, 4000);
    assert.equal(a.currentTime, 3000);
    assert.equal(a.finished, false);
    assert.equal(a.playbackRate, -1);
  });
  test('seeking works as expected', function() {
    tick(690);
    var a = document.body.animate([], 2000);
    tick(700);
    tick(900);
    assert.equal(a.currentTime, 200);
    a.currentTime = 600;
    assert.equal(a.currentTime, 600);
    assert.equal(a.startTime, 300);
    a.reverse();
    tick(1000);
    assert.equal(a.startTime, 1600);
    a.currentTime = 300;
    assert.equal(a.currentTime, 300);
    assert.equal(a.startTime, 1300);
  });
  test('seeking while paused works as expected', function() {
    tick(790);
    var a = document.body.animate([], 1000);
    tick(800);
    tick(1000);
    a.pause();
    assert.equal(a.currentTime, null);
    assert.equal(a.startTime, null);
    assert.equal(a._paused, true);
    a.currentTime = 500;
    assert.equal(a.startTime, null);
    assert.equal(a._paused, true);
  });
  test('setting start time while paused is ignored', function() {
    tick(900);
    var a = document.body.animate([], 1234);
    a.pause();
    assert.equal(a.startTime, null);
    assert.equal(a.currentTime, null);
    a.startTime = 2232;
    assert.equal(a.startTime, null);
    assert.equal(a.currentTime, null);
  });
  test('setting playbackRate sets startTime to null unless the playbackRate is not changing, ' +
      'preserves the current time', function() {
        tick(0);
        var a = document.body.animate([], 1000);
        tick(1);
        tick(11);
        assert.equal(a.currentTime, 10);

        a.playbackRate = 2;
        assert.equal(a.playbackRate, 2);
        assert.equal(a.currentTime, 10);
        assert.equal(a.startTime, null);
        tick(12);
        assert.equal(a.currentTime, 10);
        assert.equal(a.startTime, 7);
        tick(22);
        assert.equal(a.currentTime, 30);
        assert.equal(a.startTime, 7);

        a.playbackRate = -1;
        assert.equal(a.playbackRate, -1);
        assert.equal(a.currentTime, 30);
        assert.equal(a.startTime, null);
        tick(23);
        assert.equal(a.currentTime, 30);
        assert.equal(a.startTime, 53);
        tick(33);
        assert.equal(a.currentTime, 20);
        assert.equal(a.startTime, 53);

        a.playbackRate = -1;
        assert.equal(a.playbackRate, -1);
        assert.equal(a.currentTime, 20);
        assert.equal(a.startTime, 53);
        tick(43);
        assert.equal(a.currentTime, 10);
        assert.equal(a.startTime, 53);
      }
  );
  test('setting playbackRate puts animation back into effect if it is not finished', function() {
    tick(0);
    var a = document.body.animate([], 1000);
    assert.equal(a.playbackRate, 1);
    tick(1);
    tick(1002);
    assert.equal(a.currentTime, 1000);

    a.playbackRate = -1;
    assert.equal(a.playbackRate, -1);
    assert.equal(a.currentTime, 1000);
    tick(1003);
    assert.equal(a.currentTime, 1000);
    tick(1503);
    assert.equal(a.currentTime, 500);
  });
  test('setting playbackRate does not put animation back into effect if it is finished', function() {
    tick(0);
    var a = document.body.animate([], 1000);
    assert.equal(a.playbackRate, 1);
    tick(1);
    tick(1002);
    assert.equal(a.currentTime, 1000);
    assert.equal(a.startTime, 1);

    a.playbackRate = 0.5;
    assert.equal(a.playbackRate, 0.5);
    assert.equal(a.currentTime, 1000);
    assert.equal(a.startTime, null);
    tick(1003);
    assert.equal(a.currentTime, 1000);
    assert.equal(a.startTime, -997);
    tick(1503);
    assert.equal(a.currentTime, 1000);
    assert.equal(a.startTime, -997);
  });
  test('finishing works as expected', function() {
    tick(1000);
    var a = document.body.animate([], 2000);
    a.finish();
    assert.equal(a.startTime, 0);
    assert.equal(a.currentTime, 2000);
    a.reverse();
    a.finish();
    assert.equal(a.currentTime, 0);
    assert.equal(a.startTime, 2000);
    tick(2000);
  });
  test('cancelling clears all effects', function() {
    tick(0);
    var target = document.createElement('div');
    document.documentElement.appendChild(target);
    var animation = target.animate([{marginLeft: '50px'}, {marginLeft: '50px'}], 1000);
    tick(10);
    tick(110);
    assert.equal(getComputedStyle(target).marginLeft, '50px');
    animation.cancel();
    // getComputedStyle forces a tick.
    assert.equal(getComputedStyle(target).marginLeft, '0px');
    assert.deepEqual(webAnimations1.timeline._animations, []);
    tick(120);
    assert.equal(getComputedStyle(target).marginLeft, '0px');
    assert.deepEqual(webAnimations1.timeline._animations, []);
    document.documentElement.removeChild(target);
  });
  test('cancelling a newly created animation clears all effects', function() {
    tick(0);
    var target = document.createElement('div');
    document.documentElement.appendChild(target);
    var animation = target.animate([{marginLeft: '50px'}, {marginLeft: '50px'}], 1000);
    assert.equal(getComputedStyle(target).marginLeft, '50px');
    animation.cancel();
    assert.equal(getComputedStyle(target).marginLeft, '0px');
    document.documentElement.removeChild(target);
  });
  test('startTime is set on first tick if timeline hasn\'t started', function() {
    webAnimations1.timeline.currentTime = undefined;
    var a = document.body.animate([], 1000);
    tick(0);
    tick(100);
    assert.equal(a.startTime, 0);
  });
  test('animations which are finished and not filling get discarded', function() {
    tick(90);
    var nofill = document.body.animate([], 100);
    var fill = document.body.animate([], {duration: 100, fill: 'forwards'});
    assert.deepEqual(webAnimations1.timeline._animations, [nofill._animation || nofill, fill._animation || fill]);
    tick(100);
    assert.deepEqual(webAnimations1.timeline._animations, [nofill._animation || nofill, fill._animation || fill]);
    tick(400);
    assert.deepEqual(webAnimations1.timeline._animations, [fill._animation || fill]);
  });
  test('discarded animations get re-added on modification', function() {
    tick(90);
    var animation = document.body.animate([], 100);
    tick(100);
    tick(400);
    assert.deepEqual(webAnimations1.timeline._animations, []);
    animation.currentTime = 0;
    assert.deepEqual(webAnimations1.timeline._animations, [animation._animation || animation]);
  });
  test('animations in the before phase are not discarded', function() {
    tick(100);
    var animation = document.body.animate([], 100);
    animation.currentTime = -50;
    tick(110);
    assert.deepEqual(webAnimations1.timeline._animations, [animation._animation || animation]);
  });
  test('animations that go out of effect should not clear the effect of animations that are in effect', function() {
    var target = document.createElement('div');
    document.body.appendChild(target);
    tick(0);
    var animationBehind = target.animate([{marginLeft: '200px'}, {marginLeft: '200px'}], 200);
    var animationInfront = target.animate([{marginLeft: '100px'}, {marginLeft: '100px'}], 100);
    tick(50);
    assert.equal(getComputedStyle(target).marginLeft, '100px', 't = 50');
    tick(150);
    assert.equal(getComputedStyle(target).marginLeft, '200px', 't = 150');
    tick(250);
    assert.equal(getComputedStyle(target).marginLeft, '0px', 't = 250');
    document.body.removeChild(target);
  });
  test('animation modifications should update CSS effects immediately', function() {
    var target = document.createElement('div');
    document.body.appendChild(target);
    tick(0);
    var animationBehind = target.animate([{width: '1234px'}, {width: '1234px'}], {duration: 1, fill: 'both'});
    var animationInfront = target.animate([{width: '0px'}, {width: '100px'}], 100);
    assert.equal(getComputedStyle(target).width, '0px');
    animationInfront.currentTime = 50;
    assert.equal(getComputedStyle(target).width, '50px');
    animationInfront.currentTime = 100;
    assert.equal(getComputedStyle(target).width, '1234px');
    animationInfront.play();
    assert.equal(getComputedStyle(target).width, '0px');
    animationInfront.startTime = -50;
    assert.equal(getComputedStyle(target).width, '50px');
    document.body.removeChild(target);
  });
  test('KeyframeEffect that hasn\'t been played has playState \'idle\'', function() {
    var effect = new webAnimations1KeyframeEffect(document.body, [], 1000);
    var a = new webAnimations1Animation(effect);
    assert.equal(a.playState, 'idle');
  });
  test('playState works for a simple effect', function() {
    var a = document.body.animate([], 1000);
    tick(0);
    assert.equal(a.playState, 'running');
    tick(100);
    assert.equal(a.playState, 'running');
    a.pause();
    assert.equal(a.playState, 'pending');
    tick(101);
    assert.equal(a.playState, 'paused');
    a.play();
    assert.equal(a.playState, 'pending');
    tick(102);
    assert.equal(a.playState, 'running');
    tick(1002);
    assert.equal(a.playState, 'finished');
  });
  test('Play after cancel', function() {
    var a = document.body.animate([], 1000);
    assert.equal(a.playState, 'pending');
    tick(0);
    a.cancel();
    assert.equal(a.playState, 'idle');
    assert.equal(a.currentTime, null);
    assert.equal(a.startTime, null);
    tick(1);
    assert.equal(a.playState, 'idle');
    assert.equal(a.currentTime, null);
    assert.equal(a.startTime, null);
    a.play();
    assert.equal(a.playState, 'pending');
    assert.equal(a.currentTime, 0);
    assert.equal(a.startTime, null);
    tick(10);
    assert.equal(a.playState, 'running');
    assert.equal(a.currentTime, 0);
    assert.equal(a.startTime, 10);
  });
  test('Reverse after cancel', function() {
    var a = document.body.animate([], 300);
    tick(0);
    a.cancel();
    assert.equal(a.playState, 'idle');
    assert.equal(a.currentTime, null);
    assert.equal(a.startTime, null);
    tick(1);
    a.reverse();
    assert.equal(a.playState, 'pending');
    assert.equal(a.currentTime, 300);
    assert.equal(a.startTime, null);
    tick(100);
    assert.equal(a.playState, 'running');
    assert.equal(a.currentTime, 300);
    assert.equal(a.startTime, 400);
    tick(300);
    assert.equal(a.playState, 'running');
    assert.equal(a.currentTime, 100);
    assert.equal(a.startTime, 400);
    tick(400);
    assert.equal(a.playState, 'finished');
    assert.equal(a.currentTime, 0);
    assert.equal(a.startTime, 400);
  });
  test('Finish after cancel', function() {
    var a = document.body.animate([], 300);
    tick(0);
    a.cancel();
    assert.equal(a.playState, 'idle');
    assert.equal(a.currentTime, null);
    assert.equal(a.startTime, null);
    tick(1);
    a.finish();
    assert.equal(a.playState, 'idle');
    assert.equal(a.currentTime, null);
    assert.equal(a.startTime, null);
    tick(2);
    assert.equal(a.playState, 'idle');
    assert.equal(a.currentTime, null);
    assert.equal(a.startTime, null);
  });
  test('Pause after cancel', function() {
    var a = document.body.animate([], 300);
    tick(0);
    a.cancel();
    assert.equal(a.playState, 'idle');
    assert.equal(a.currentTime, null);
    assert.equal(a.startTime, null);
    tick(1);
    a.pause();
    assert.equal(a.playState, 'idle');
    assert.equal(a.currentTime, null);
    assert.equal(a.startTime, null);
  });
  test('Animations ignore NaN times', function() {
    var a = document.body.animate([], 300);
    a.startTime = 100;
    tick(110);
    assert.equal(a.currentTime, 10);
    a.startTime = NaN;
    assert.equal(a.startTime, 100);
    a.currentTime = undefined;
    assert.equal(a.currentTime, 10);
  });
  test('play() should not set a start time', function() {
    var a = document.body.animate([], 1000);
    a.cancel();
    assert.equal(a.startTime, null);
    assert.equal(a.playState, 'idle');
    a.play();
    assert.equal(a.startTime, null);
    assert.equal(a.playState, 'pending');
  });
  test('reverse() should not set a start time', function() {
    var a = document.body.animate([], 1000);
    a.cancel();
    assert.equal(a.startTime, null);
    assert.equal(a.playState, 'idle');
    a.reverse();
    assert.equal(a.startTime, null);
    assert.equal(a.playState, 'pending');
  });
});
