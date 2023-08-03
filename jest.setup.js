/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2023
 */

import "@inrupt/jest-jsdom-polyfills";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

// setup enzyme's react adapter
Enzyme.configure({
  adapter: new Adapter(),
});
