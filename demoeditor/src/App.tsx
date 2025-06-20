// in src/App.js
import * as React from "react";
import { Admin, EditGuesser, ListGuesser, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { DemokeyframeList } from "./resources/demokeyframes/KeyFrameList";
import { DemokeyframeEdit } from "./resources/demokeyframes/KeyFramesEdit";
import { DemokeyframeCreate } from "./resources/demokeyframes/KeyFramesCreate";
import { DemosEdit } from "./resources/demos/DemosEdit";
import categories from "./resources/categories";
import keyframes from "./resources/demokeyframes";
import sinewaves from "./resources/sinewaves";
import { theme } from "./Theme";
import explicitkeyframes from "./resources/explicitkeyframes";
import {
  TimelineContext,
  TimelineContextProvider,
} from "./components/timeline/TimelineContext";
import { TimelineView } from "./components/timeline/TimelineView";

const dataProvider = jsonServerProvider("http://localhost:3001");

const App = () => (
  <TimelineContextProvider>
    {/* @ts-ignore */}
    <Admin dataProvider={dataProvider} theme={theme}>
      <Resource {...keyframes} />
      <Resource {...sinewaves} />
      <Resource {...explicitkeyframes} />
      <Resource name="demos" list={ListGuesser} edit={DemosEdit} />
      <Resource {...categories} />
    </Admin>
    <TimelineView></TimelineView>
  </TimelineContextProvider>
);
export default App;
