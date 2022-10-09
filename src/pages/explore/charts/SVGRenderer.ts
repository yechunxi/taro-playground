import SVGPainter from "zrender/lib/svg/Painter";

import { vNodeToString } from "./SVGCore";
import { updateAttrs } from 'zrender/lib/svg/patch';

const isRn = navigator?.product === "ReactNative";

import { DOMParser } from '@xmldom/xmldom'

globalThis.DOMParser = DOMParser;
class CustomSVGPainter extends SVGPainter {
  constructor(root: HTMLElement, storage, opts, id) {
    if(isRn) {
      // @ts-ignore
      super(null, storage, opts);
      // @ts-ignore
      this._svgDom = this._oldVNode.elm = root.elm;
      // @ts-ignore
      this._svgDom.setZrenderId?.(id);
      // @ts-ignore
      updateAttrs(null, this._oldVNode);
      this.root = root
    } else {
      super(root, storage, opts);
    }
  }
  refresh() {
    if(isRn) {
      const vnode = this.renderToVNode({
        willUpdate: true
      });
      // Disable user selection.
      vnode.attrs.style = "position:absolute;left:0;top:0;user-select:none";
      // @ts-ignore
      if (this._svgDom.patch) {
        // @ts-ignore
        this._svgDom.patch(this._oldVNode, vnode);
        // @ts-ignore
      } else if (this._svgDom.patchString) {
        // @ts-ignore
        this._svgDom.patchString(this._oldVNode, vNodeToString(vnode));
      }
      // @ts-ignore
      this._oldVNode = vnode;
    } else {
      super.refresh()
    }
  }
}

export function SVGRenderer(registers) {
  registers.registerPainter("svg", CustomSVGPainter);
}
