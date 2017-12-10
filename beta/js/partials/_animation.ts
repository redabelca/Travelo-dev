import { data, top } from "./data";
import { addEvent, getEl } from "./_DOM";
import { isItAppears, getOffsetHeight } from "./_layout";
import { throttle } from "../partials/_optimization";

//Animation
export function triggerAnimationMonitor() {
  data['distancesArray'].sort((a, b) => {
    return a.distance - b.distance;
  });
  addEvent(window, 'scroll', throttle(() => {
    if (data['distancesArray'][0] && isItAppears(data['distancesArray'][0].distance)) {
      data['distancesArray'][0].fn(data['distancesArray'][0].elNode);
      data['distancesArray'].shift();
    }
  }, 400));
}

export class animationElement {
  elNode: any;
  top: number;
  height: number;
  distance: number;
  fn: Function;
  constructor(elSelector: string, fn: Function, percentOfHeight?: number) {
    this.elNode = getEl(elSelector);
    this.top = top(this.elNode);
    this.height = getOffsetHeight(this.elNode);
    this.fn = fn;
    this.distance = this.top + (this.height * (percentOfHeight || 0)) - (window.innerHeight + data.scrollTop);
    //register animation info into an array for the monitor
    if (typeof data['distancesArray'] !== "object") {
      data['distancesArray'] = [];
    }
    data['distancesArray'].push({
      elNode: this.elNode,
      distance: this.distance,
      fn: this.fn
    });
  }
}

export function whichActionEvent(action: string /*either animation or transition*/) {
  var t, el = document.body,
    transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    },
    animations = {
      'animation': 'animationend',
      'OAnimation': 'oAnimationEnd',
      'MozAnimation': 'animationend',
      'WebkitAnimation': 'webkitAnimationEnd'
    };

  if (action === 'animation') {
    for (t in animations) {
      if (el.style[t] !== undefined) {
        data[action + 'Event'] = animations[t];
        return animations[t];
      }
    }
  } else {
    for (t in transitions) {
      if (el.style[t] !== undefined) {
        data[action + 'Event'] = transitions[t];
        return transitions[t];
      }
    }
  }
}

export function onActionEnd(elem: Element, action, fn, cb?) {
  var actionEvent = data[action + 'Event'] || whichActionEvent(action);
  addEvent(elem, actionEvent, fn(elem));
  cb(elem);
}