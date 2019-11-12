import React, { useState } from "react";
import NavBar from "../controls/NavBar";
import styles from "./Dashboard.module.scss"

const Dashboard: React.FC  = () => {

    return <NavBar className={styles.navbar} userName={"Ben"} />;
}

export default Dashboard;