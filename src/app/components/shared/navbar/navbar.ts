import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Collapse } from 'flowbite';
import type { CollapseInterface, CollapseOptions } from 'flowbite';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit {
    @ViewChild('menu') menu!: ElementRef<HTMLElement>;
    @ViewChild('trigger') trigger!: ElementRef<HTMLElement>;

  private collapse!: CollapseInterface;

  ngAfterViewInit(): void {

    this.collapse = new Collapse(
      this.menu.nativeElement,
      this.trigger.nativeElement
    );
  }
}
