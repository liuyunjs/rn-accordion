import { unstable_batchedUpdates } from 'react-native';
import EventEmitter from '@liuyunjs/eventemitter';

export class AccordionManager extends EventEmitter {
  private _selected: Record<string, 1> = {};
  private _subscribe?:
    | ((selected: string[]) => void)
    | ((selected?: string) => void);
  private _accordion?: boolean;

  private _patchUpdate() {
    unstable_batchedUpdates(() => {
      this.emit('update');
    });
  }

  setSelected(selected?: string[] | string | number | number[]) {
    const arr =
      selected != null ? (Array.isArray(selected) ? selected : [selected]) : [];

    const previous = this._selected;

    let notEqualed = Object.keys(previous).length !== arr.length;

    this._selected = {};
    arr.forEach((item) => {
      this._selected[item] = 1;
      notEqualed = notEqualed || !previous[item];
    });

    notEqualed && this._patchUpdate();
  }

  toggle(key: string) {
    const isRemove = this._selected[key];

    if (this._accordion) {
      this._selected = isRemove ? {} : { [key]: 1 };

      if (this._subscribe) {
        (this._subscribe as (selected?: string) => void)(
          isRemove ? undefined : key,
        );
      }
    } else {
      if (isRemove) {
        delete this._selected[key];
      } else {
        this._selected[key] = 1;
      }
      if (this._subscribe) {
        (this._subscribe as (selected: string[]) => void)(
          Object.keys(this._selected),
        );
      }
    }

    this._patchUpdate();
  }

  subscribe(
    subscribe?: ((selected: string[]) => void) | ((selected?: string) => void),
  ) {
    this._subscribe = subscribe;
  }

  accordion(accordion?: boolean) {
    this._accordion = accordion;
  }

  isSelected(key: string) {
    return !!this._selected[key];
  }
}
