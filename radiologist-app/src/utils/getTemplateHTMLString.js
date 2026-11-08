// src/utils/getTemplateHTMLString.js
export default function getTemplateHTMLString({
  patient,
  centre,
  report,
  templateData,
  footerItems = [],
}) {
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const footerHTML = footerItems.length
    ? `Services Offered: ${footerItems.join(" | ")}`
    : "";

  const data = `
    <div style="
      font-family: 'Roboto', 'Segoe UI', 'Helvetica Neue', Helvetica, sans-serif;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      aspect-ratio: 1/1.414;
      padding: 16px 24px;
      height: 100%;
      width: 100%;
    ">
      <div style="flex: 1; display: flex; flex-direction: column; padding: 0 32px; box-sizing: border-box; height: 100%;">
        <!-- HEADER -->
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
          <!-- Centre Details -->
          <div style="text-align: center; flex-grow: 1; order: 1;">
            <h1 style="margin: 0; color: #0078d4; font-size: 24px; font-weight: 700;">
              ${centre.name}
            </h1>
            <div style="font-size: 14px; margin-top: 6px; color: #333;">
              <div style="font-weight: bold; color: #d41500;">
                Diagnostic center and speciality clinic
              </div>
              <div style="margin-top: 4px;">${centre.address}</div>
              <div>
                <a href="${centre.website}" style="color: #0078d4;">
                  ${centre.website?.split("://")[1]}
                </a>
                |
                Email: ${centre.email}
              </div>
              <div>
                Phone: ${
                  Array.isArray(centre.contacts)
                    ? centre.contacts.join(" / ")
                    : centre.contacts
                }
              </div>
            </div>
          </div>
          <!-- Logo on the Right -->
          <div style="flex-shrink: 0; order: 2;">
            <img
              src="${centre.logo || ""}"
              alt="Centre Logo"
              style="width: 80px; height: 80px; border-radius: 50%; background: #eee; ${
                centre.logo ? "" : "opacity: 0;"
              }"
            />
          </div>
        </div>

        <!-- Header Ends Here -->

        <hr style="border: none; border-top: 1px solid black; margin: 12px 0px;" />

        <!-- PATIENT INFO CARD -->
        <div style="display: flex; justify-content: center;">
          <div style="width: 95%; border: 1px solid #ccc; border-radius: 8px; font-family: 'Segoe UI', sans-serif; font-size: 14px; padding: 0px 20px;">
            <!-- Row 1 -->
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin: 12px 0px;">
              <!-- Patient Name -->
              <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 250px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

                <div style="margin-bottom: 14px;">
                  <p style="font-weight: 600;">Patient Name:
                    <span style="font-weight: 400;">- ${patient.name}</span>
                  </p>
                </div>
              </div>
              <!-- Reg No -->
              <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 250px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                  <path d="M2.995 1a.625.625 0 1 0 0 1.25h.38v2.125a.625.625 0 1 0 1.25 0v-2.75A.625.625 0 0 0 4 1H2.995ZM3.208 7.385a2.37 2.37 0 0 1 1.027-.124L2.573 8.923a.625.625 0 0 0 .439 1.067l1.987.011a.625.625 0 0 0 .006-1.25l-.49-.003.777-.776c.215-.215.335-.506.335-.809 0-.465-.297-.957-.842-1.078a3.636 3.636 0 0 0-1.993.121.625.625 0 1 0 .416 1.179ZM2.625 11a.625.625 0 1 0 0 1.25H4.25a.125.125 0 0 1 0 .25H3.5a.625.625 0 1 0 0 1.25h.75a.125.125 0 0 1 0 .25H2.625a.625.625 0 1 0 0 1.25H4.25a1.375 1.375 0 0 0 1.153-2.125A1.375 1.375 0 0 0 4.25 11H2.625ZM7.25 2a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6ZM7.25 7.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-6ZM6.5 13.25a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Z" />
                </svg>

                <div style="margin-bottom: 14px;">
                  <p style="font-weight: 600;">Reg No:
                    <span style="font-weight: 400; font-size: 10px;">- ${
                      patient.id || "-"
                    } 
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Row 2 -->
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 12px;">
              <!-- Refer By -->
              <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 250px;">
                <!-- SVG omitted -->
                <div style="margin-bottom: 14px;">
                  <p style="font-weight: 600;">Refer By:
                    <span style="font-weight: 400;">- ${
                      patient.referredBy || "-"
                    }
                    </span>
                  </p>
                </div>
              </div>

              <!-- Age / Gender -->
              <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 250px;">
                
                <div style="margin-bottom: 14px;">
                  <p style="font-weight: 600;">Age / Gender:
                    <span style="font-weight: 400;">- ${patient.age} Yrs / ${
                      patient.gender
                    }</span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Row 3 -->
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 12px;">
              <!-- Department -->
              <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 250px;">
                <!-- SVG omitted -->
                <div style="margin-bottom: 14px;">
                  <p style="font-weight: 600;">Department: 
                    <span style="font-weight: 400;">- ${report.xRayType}</span>
                  </p>
                </div>
              </div>

              <!-- Date -->
              <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 250px;">
                <!-- SVG omitted -->
                <div style="margin-bottom: 14px;">
                  <p style="font-weight: 600;">Date:
                    <span style="font-weight: 400;">- ${formatDate(new Date())}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- REPORT TITLE -->
        <div style="font-weight: bold; font-size: 18px; margin-top: 12px; text-align: center;">
          ${report.title || "CHEST X-RAY PA VIEW Report"}
        </div>

        <!-- BODY -->
        <style>
          .templateWrapper * {
            font-size: revert;
            font-weight: revert;
          }
        </style>
        <div class="templateWrapper" style="margin: 0px 32px; flex: 1;">
          ${templateData}
        </div>

        <!-- Signature and Footer -->
        <div style="margin-top: 20px; padding: 0 32px;">
          <img 
            src="${patient.signature}" 
            alt="Radiologist Signature" 
            style="width: 150px; height: 50px; object-fit: contain" 
            onerror="this.onerror=null; this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';" 
            crossorigin="anonymous" 
            loading="eager" 
            class="signature-image"
          />
          <p style="font-size: 14px; color: #555; margin-top: 20px;">
            <strong>
              Issued by: <strong>${patient.referredBy}</strong><br />
              Date: <strong>${formatDate(new Date())}</strong>
            </strong>
          </p>
        </div>

        <div style="text-align: left; margin-top: 20px; padding: 0 32px;">
          <p style="font-size: 14px; color: #555; line-height: 1.5;">
            <span style="font-weight: bold"> Disclaimer: </span>
            This is a generated radiology report based on images and clinical inputs provided by the referring center. It is intended for use by qualified healthcare professionals. All findings should be correlated with clinical evaluation and other investigations.
          </p>
          <p style="font-size: 14px; color: #555; line-height: 1.5;">
            The reporting radiologist and diagnostic center are not responsible for decisions made solely on the basis of this report. A digital signature is included for verification.
          </p>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="
        
        border-top: 2px solid #0078d4;
        margin-top: 20px;
        padding: 10px 0px;
        font-size: 12px;
        text-align: center;
        color: #666;
        line-height: 1.6;
      ">
        ${footerHTML}
      </div>
    </div>`;

  const finalHTML = data.replace(
    /{{BREAK}}/g,
    '<div class="page-break"></div>'
  );
  return finalHTML;
}
