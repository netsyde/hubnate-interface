import React, { Suspense } from "react";
import { observer } from "mobx-react";
import rootStore from "@store/RootStore";
const stores = { rootStore };
import { renderRoutes } from "react-router-config";
import "./Main.scss";

const Main = observer((props: any) => {
  const { route } = props;

  return (
    <Suspense fallback={<h1></h1>}>
      {renderRoutes(route.routes)}
    </Suspense>
  );
});

export default Main;