/*
 * liz - Installation assistant for Linux on IBM Z
 *
 * (C) Copyright IBM Corp. 2024
 */

const setNavigationalStepsActivity = (flag = false, steps) => {
  const stepsCopy = JSON.parse(JSON.stringify(steps));
  const keys = Object.keys(stepsCopy);

  let i;
  for (i = 0; i < keys.length; i++) {
    const stateKey = keys[i];

    if (stateKey !== "inputFileSelection") {
      stepsCopy[stateKey].disabled = flag;
    }
  }

  return stepsCopy;
};

const updateIsDisabled = (steps) => {
  const hasInputFileSelection =
    steps && typeof steps.inputFileSelection === "object";
  const isComplete = steps?.inputFileSelection?.complete ?? false;

  if (hasInputFileSelection && !isComplete) {
    return setNavigationalStepsActivity(true, steps);
  } else if (hasInputFileSelection && isComplete) {
    return setNavigationalStepsActivity(false, steps);
  }

  return null;
};

export { updateIsDisabled };
