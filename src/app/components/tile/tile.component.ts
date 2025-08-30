import { Component, HostBinding, input, output } from '@angular/core';
import { Mine } from '../../models/mine';
import { Coord } from '../../models/coord';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent {
  protected mine = input.required<Mine>(); // Mine

  protected leftClick = output<Coord>();
  protected rightClick = output<Coord>();
  protected bomb = output<void>();

  @HostBinding('class')
  get componentClass(): string {
    const classes = ['btn', 'border', 'rounded'];

    if (this.mine().value >= 0 && this.mine().isVisible) {
      classes.push(`color${this.mine().value}`);
    }

    if (this.mine().isVisible && this.mine().isMine) {
      classes.push('mine');
    }

    if (this.mine().isMarked) {
      classes.push('mark');
    }

    return classes.join(' ');
  }

  /**
   * Handling left click
   * If the tile is mine, call bomb event, otherwise the left click event will be called
   */
  protected handleLeftClick() {
    this.withMine((mine) => {
      if (!mine.isVisible && !mine.isMarked) {
        if (mine.isMine) {
          this.bomb.emit();
        } else {
          this.leftClick.emit({ x: mine.x, y: mine.y });
        }
      }
    });
  }

  /**
   * Handling right click
   * If it's not visible, it will call the right click event
   */
  protected handleRightClick() {
    this.withMine((mine) => {
      if (!mine.isVisible) {
        this.rightClick.emit({ x: mine.x, y: mine.y });
      }
    });
    return false;
  }

  private withMine(fn: (mine: Mine) => void): void {
    const mine = this.mine();

    if (mine) {
      fn(mine);
    }
  }
}
