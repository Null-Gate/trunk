import React from "react";
import Path from "./routes/Path";
import Layout from "./pages/Layout";

const App: React.FC = () => {
  return (
    <Layout>
      <Path />
    </Layout>
  );
};

export default App;
