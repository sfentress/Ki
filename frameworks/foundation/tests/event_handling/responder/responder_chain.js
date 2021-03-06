// ==========================================================================
// Ki.Statechart Unit Test
// ==========================================================================
/*globals Ki statechart */

var pane, viewA, viewB, stateA, stateB, responder = null;

module("Ki.Statechart: Responder Chain Tests", {
  setup: function() {
    pane = SC.MainPane.create({
      
      childViews: 'viewA'.w(),
      
      viewA: SC.View.extend({
        
        childViews: 'viewB'.w(),
        
        viewB: SC.View.extend(Ki.StatechartManager, {

          initialState: 'a',

          a: Ki.State.design({
            mouseDown: function(evt) {
              responder = this;
              this.gotoState('b');
            },
            
            click: function(evt) {
              responder = this;
              return NO;
            }
          }),

          b: Ki.State.design({
            mouseUp: function(evt) {
              responder = this;
              this.gotoState('a');
            }

          }),
          
          keyUp: function(evt) { 
            responder = this;
          }

        }),
        
        keyUp: function(evt) { 
          responder = this;
        },
        
        keyDown: function(evt) { 
          responder = this;
        },
        
        click: function(evt) {
          responder = this;
        }
        
      })
      
    });
    
    viewA = pane.get('viewA');
    viewB = viewA.get('viewB');
    stateA = viewB.getState('a');
    stateB = viewB.getState('b');
  },
  
  teardown: function() {
    pane = viewA = viewB = stateA = stateB = responder = null;
  }
});

test("check state A and B are responders -- mouseDown, mouseUp", function() {
  equals(responder, null, "responder should be null");
  ok(stateA.get('isCurrentState'), "state A should be current state");
  ok(!stateB.get('isCurrentState'), "state B should not be current state");
  
  pane.sendEvent('mouseDown', {}, viewB);
  
  ok(!stateA.get('isCurrentState'), "state A should not be current state");
  ok(stateB.get('isCurrentState'), "state B shold be current state");
  equals(responder, stateA, "state A should be responder");

  pane.sendEvent('mouseUp', {}, viewB);
  
  ok(stateA.get('isCurrentState'), "state A should be current state");
  ok(!stateB.get('isCurrentState'), "state B shold not be current state");
  equals(responder, stateB, "state B should be responder");
});

test("check view B is responder -- keyUp", function() {
  equals(responder, null, "responder should be null");
  pane.sendEvent('keyUp', {}, viewB);
  equals(responder, viewB, "view A should be responder");
});

test("check view A is responder -- keyDown", function() {
  equals(responder, null, "responder should be null");
  pane.sendEvent('keyDown', {}, viewB);
  equals(responder, viewA, "view A should be responder");
});

test("check view A is responder -- click", function() {
  equals(responder, null, "responder should be null");
  pane.sendEvent('click', {}, viewB);
  equals(responder, viewA, "view A should be responder");
});