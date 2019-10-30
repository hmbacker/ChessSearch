import React from "react";

function ResultHeaderCell({
  title,
  fieldName,
  paramObject,
  handleHeaderClick
}) {
  let text = title;

  // Show up/down triangle if the results are sorted by this field
  if (fieldName === paramObject.orderby) {
    text += " " + (paramObject.descending ? "▾" : "▴");
  }

  return (
    <td
      className="result-header-cell"
      onClick={() => handleHeaderClick(fieldName)}
    >
      {text}
    </td>
  );
}

export default ResultHeaderCell;
