"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <SwaggerUI url="/api/openapi.json" />
    </div>
  );
}
