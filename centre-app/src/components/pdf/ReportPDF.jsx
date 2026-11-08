import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts (optional but recommended for better styling)
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flexGrow: 1,
    textAlign: 'center',
  },
  centerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0078d4',
    marginBottom: 5,
  },
  centerTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d41500',
    marginBottom: 3,
  },
  centerDetails: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 2,
  },
  logo: {
    width: 60,
    height: 60,
  },
  divider: {
    borderBottom: '1px solid #000',
    marginVertical: 10,
  },
  patientCard: {
    border: '1px solid #ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    color: 'black',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    width: '50%',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 5,
  },
  infoValue: {
    fontSize: 10,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  reportContent: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 20,
  },
  signatureSection: {
    marginTop: 30,
  },
  signature: {
    width: 120,
    height: 40,
    objectFit: 'contain',
    marginBottom: 10,
  },
  issuedBy: {
    fontSize: 10,
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#555555',
    textAlign: 'center',
    borderTop: '1px solid #0078d4',
    paddingTop: 10,
  },
  disclaimer: {
    fontSize: 9,
    color: '#555555',
    marginTop: 15,
    lineHeight: 1.5,
  },
});

// Helper function to format date
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// Enhanced HTML to React-PDF component converter
const parseHtmlContent = (htmlString) => {
  if (!htmlString) {
    console.log('No HTML content to parse');
    return [<Text key="empty">No content provided</Text>];
  }
  
  // Log the incoming HTML for debugging
  console.log('Parsing HTML content:', htmlString);
  
  // Handle plain text with no HTML tags
  if (typeof htmlString === 'string' && !htmlString.includes('<') && !htmlString.includes('>')) {
    return [<Text key="plain-text" style={styles.reportContent}>{htmlString.trim()}</Text>];
  }
  
  // Clean HTML string and decode entities
  const cleanedHtml = htmlString
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Simplified approach to handle formatted text
  const processFormattedText = (text) => {
    if (!text) return [];
    
    // First replace all strong tags
    let processedText = text;
    const boldTexts = [];
    const italicTexts = [];
    
    // Extract and store bold text patterns
    const boldRegex = /<strong>([^<]+)<\/strong>/g;
    let boldMatch;
    while ((boldMatch = boldRegex.exec(text)) !== null) {
      const matchedText = boldMatch[1];
      const replacement = `__BOLD_${boldTexts.length}__`;
      boldTexts.push(matchedText);
      processedText = processedText.replace(boldMatch[0], replacement);
    }
    
    // Extract and store italic text patterns
    const italicRegex = /<(i|em)>([^<]+)<\/(i|em)>/g;
    let italicMatch;
    while ((italicMatch = italicRegex.exec(text)) !== null) {
      const matchedText = italicMatch[2];
      const replacement = `__ITALIC_${italicTexts.length}__`;
      italicTexts.push(matchedText);
      processedText = processedText.replace(italicMatch[0], replacement);
    }
    
    // Now split the text by our placeholders
    const parts = [];
    const segments = processedText.split(/(__|__)/); // This creates segments with placeholders
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      
      // Check for bold placeholder
      if (segment.startsWith('__BOLD_')) {
        const index = parseInt(segment.replace('__BOLD_', '').replace('__', ''));
        parts.push({
          type: 'bold',
          content: boldTexts[index]
        });
      }
      // Check for italic placeholder
      else if (segment.startsWith('__ITALIC_')) {
        const index = parseInt(segment.replace('__ITALIC_', '').replace('__', ''));
        parts.push({
          type: 'italic',
          content: italicTexts[index]
        });
      }
      // Regular text
      else if (segment.trim()) {
        parts.push({
          type: 'regular',
          content: segment
        });
      }
    }
    
    return parts;
  };
  
  // Function to extract content from HTML string
  const extractContent = (html) => {
    try {
      // Simple HTML parser using DOM API
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    } catch (e) {
      console.error("Error parsing HTML:", e);
      // Fallback: strip tags manually
      return html.replace(/<[^>]*>/g, '');
    }
  };

  // Simple function to strip HTML tags
  const stripTags = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };
  
  // Array to store React-PDF components
  const result = [];
  let componentIndex = 0;
  
  try {
    // Match all headings first with their content
    const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
    let headings = [...cleanedHtml.matchAll(headingRegex)];
    
    // Match all paragraphs
    const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let paragraphs = [...cleanedHtml.matchAll(paragraphRegex)];
    
    // Match unordered lists
    const ulRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
    let uls = [...cleanedHtml.matchAll(ulRegex)];
    
    // Match ordered lists
    const olRegex = /<ol[^>]*>([\s\S]*?)<\/ol>/gi;
    let ols = [...cleanedHtml.matchAll(olRegex)];
    
    // We'll keep the primary structure as paragraphs, headings and lists
    // The formatted text within these elements will be handled by processFormattedText
    
    // Create a structure that preserves the order
    const htmlElements = [];
    
    // Add all headings with their positions
    headings.forEach(match => {
      htmlElements.push({
        type: 'heading',
        level: parseInt(match[1]),
        content: match[2], // Keep tags for processing strong
        position: match.index
      });
    });
    
    // Add all paragraphs with their positions
    paragraphs.forEach(match => {
      htmlElements.push({
        type: 'paragraph',
        content: match[1], // Keep tags for processing strong
        position: match.index
      });
    });
    
    // Add all unordered lists with their positions
    uls.forEach(match => {
      htmlElements.push({
        type: 'ul',
        content: match[1],
        rawMatch: match[0], // Store the entire raw match for debugging
        position: match.index
      });
    });
    
    // Add all ordered lists with their positions
    ols.forEach(match => {
      htmlElements.push({
        type: 'ol',
        content: match[1],
        rawMatch: match[0], // Store the entire raw match for debugging
        position: match.index
      });
    });
    
    console.log('Found lists:', uls.length, 'unordered lists,', ols.length, 'ordered lists');
    
    // Sort elements by their position in the original HTML
    htmlElements.sort((a, b) => a.position - b.position);
    
    // Log the htmlElements array before rendering
    console.log('htmlElements array:', htmlElements);
    // Now process them in order
    htmlElements.forEach(element => {
      console.log('Rendering element type:', element.type);

      if (element.type === 'heading') {
        // Process formatting tags in headings
        const processedParts = processFormattedText(element.content);
        
        result.push(
          <Text 
            key={`heading-${componentIndex++}`} 
            style={{
              ...styles.reportContent,
              fontSize: 16 - (element.level * 1),  // Larger font size difference
              fontWeight: 'bold',
              marginTop: 12,
              marginBottom: 4
            }}
          >
            {processedParts.map((part, idx) => {
              if (part.type === 'bold') {
                return <Text key={`bold-${idx}`} style={{ fontWeight: 'bold' }}>{part.content}</Text>;
              } else if (part.type === 'italic') {
                return <Text key={`italic-${idx}`} style={{ fontStyle: 'italic' }}>{part.content}</Text>;
              }
              return part.content;
            })}
          </Text>
        );
      } else if (element.type === 'paragraph') {
        // Process formatting tags in paragraphs
        const processedParts = processFormattedText(element.content);
        
        result.push(
          <Text 
            key={`para-${componentIndex++}`} 
            style={{...styles.reportContent, marginBottom: 8}}
          >
            {processedParts.map((part, idx) => {
              if (part.type === 'bold') {
                return <Text key={`bold-${idx}`} style={{ fontWeight: 'bold' }}>{part.content}</Text>;
              } else if (part.type === 'italic') {
                return <Text key={`italic-${idx}`} style={{ fontStyle: 'italic' }}>{part.content}</Text>;
              }
              return part.content;
            })}
          </Text>
        );
      } else if (element.type === 'ul' || element.type === 'ol') {
        // For list debugging
        console.log(`Processing ${element.type} list:`, element.rawMatch);
        
        // Directly extract list items
        const listItemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
        const listItems = [];
        let match;
        
        while ((match = listItemRegex.exec(element.content)) !== null) {
          listItems.push(match[1]); // Extract content within li tags
          console.log('Found list item:', match[1]);
        }
        
        // If no list items found, try a looser regex
        if (listItems.length === 0) {
          console.warn('No list items found with regular regex, trying alternate approach');
          // Just split by <li> tags
          const items = element.content.split(/<li[^>]*>/);  
          items.shift(); // Remove content before first <li>
          
          for (let i = 0; i < items.length; i++) {
            // Remove closing </li> and anything after it
            const itemContent = items[i].split('</li>')[0];
            if (itemContent.trim()) {
              listItems.push(itemContent);
              console.log('Found list item (alternate):', itemContent);
            }
          }
        }
        
        // Define specific styles for the lists
        const listStyles = {
          ul: {
            container: { marginBottom: 12, marginLeft: 10, marginTop: 4 },
            marker: { ...styles.reportContent, marginRight: 8, width: 15, fontWeight: 'normal' },
            bullet: '•',  // Bullet character
            itemContainer: { flexDirection: 'row', marginBottom: 8 },
            contentContainer: { flex: 1 },
            contentText: {...styles.reportContent, marginBottom: 0},
          },
          ol: {
            container: { marginBottom: 12, marginLeft: 10, marginTop: 4 },
            marker: { ...styles.reportContent, marginRight: 8, width: 20, textAlign: 'right', fontWeight: 'normal' },
            itemContainer: { flexDirection: 'row', marginBottom: 8 },
            contentContainer: { flex: 1 },
            contentText: {...styles.reportContent, marginBottom: 0},
          }
        };
        
        const currentListStyle = listStyles[element.type];
        
        // Add list container
        console.log('Rendering list type:', element.type, 'with items:', listItems);
        result.push(
          <View key={`list-${componentIndex++}`} style={currentListStyle.container}>
            {listItems.map((item, idx) => {
              // Strip any remaining HTML tags for safety
              const cleanItem = item.replace(/<\/?[^>]+(>|$)/g, "");
              
              // Check for formatting tags
              const hasBold = /<strong>.*?<\/strong>/i.test(item);
              const hasItalic = /<(i|em)>.*?<\/(i|em)>/i.test(item);
              
              return (
                <View key={idx} style={currentListStyle.itemContainer}>
                  {/* List marker (bullet or number) */}
                  <Text style={currentListStyle.marker}>
                    {element.type === 'ul' 
                      ? currentListStyle.bullet 
                      : `${idx + 1}.`}
                  </Text>
                  
                  {/* List item content */}
                  <View style={currentListStyle.contentContainer}>
                    {hasBold || hasItalic ? (
                      <Text style={currentListStyle.contentText}>
                        {/* If has formatting, process it */}
                        {processFormattedText(item).map((part, partIdx) => {
                          if (part.type === 'bold') {
                            return <Text key={`bold-${partIdx}`} style={{ fontWeight: 'bold' }}>{part.content}</Text>;
                          } else if (part.type === 'italic') {
                            return <Text key={`italic-${partIdx}`} style={{ fontStyle: 'italic' }}>{part.content}</Text>;
                          } else {
                            return <Text key={`regular-${partIdx}`}>{part.content}</Text>;
                          }
                        })}
                      </Text>
                    ) : (
                      <Text style={currentListStyle.contentText}>{cleanItem}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        );
      }
    });
    
    // If we couldn't parse any structured content, fall back to showing everything as plain text
    if (result.length === 0) {
      // Just use the entire text content as a fallback
      const plainText = stripTags(cleanedHtml).trim();
      result.push(
        <Text key="fallback" style={styles.reportContent}>
          {plainText}
        </Text>
      );
    }
    
  } catch (error) {
    console.error('Error parsing HTML content:', error);
    // Fallback: just show the text content
    const plainText = cleanedHtml.replace(/<[^>]*>/g, ' ').trim();
    result.push(
      <Text key="error-fallback" style={styles.reportContent}>
        {plainText}
      </Text>
    );
  }
  
  // Log the number of components created
  console.log(`Created ${result.length} components from HTML content`);
  
  return result.length > 0 ? result : [<Text key="empty">No content provided</Text>];
};

// Main PDF component
const ReportPDF = ({ patient, centre, report, templateData, footerItems = [] }) => {
  console.log('ReportPDF received templateData:', templateData);
  // Parse HTML content into React-PDF compatible components
  const contentParagraphs = parseHtmlContent(templateData || '');

  const footerText = footerItems.length
    ? `Services Offered: ${footerItems.join(" | ")}`
    : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Center Information */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.centerName}>{centre.name}</Text>
            <Text style={styles.centerTag}>Diagnostic center and speciality clinic</Text>
            <Text style={styles.centerDetails}>{centre.address}</Text>
            <Text style={styles.centerDetails}>
              Phone: {Array.isArray(centre.contacts) ? centre.contacts.join(" / ") : centre.contacts}
            </Text>
          </View>
          {centre.logoVisible && (
            <Image
              src={centre.logo}
              style={styles.logo}
              cache={false}
            />
          )}
        </View>

        <View style={styles.divider} />

        {/* Patient Information Card */}
        <View style={styles.patientCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Patient Name:</Text>
              <Text style={styles.infoValue}>{patient.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Reg No:</Text>
              <Text style={styles.infoValue}>{patient.id}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Refer By:</Text>
              <Text style={styles.infoValue}>{patient.referredBy}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age / Gender:</Text>
              <Text style={styles.infoValue}>{patient.age} Yrs / {patient.gender}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Department:</Text>
              <Text style={styles.infoValue}>{report.xRayType}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{formatDate(new Date())}</Text>
            </View>
          </View>
        </View>

        {/* Report Title */}
        <Text style={styles.reportTitle}>
          {report.title || "CHEST X-RAY PA VIEW Report"}
        </Text>

        {/* Report Content */}
        <View>
          {contentParagraphs}
        </View>

        {/* Signature and Footer */}
        <View style={styles.signatureSection}>
          <Image 
            src={patient.signature} 
            style={styles.signature}
            cache={false}
          />
          <Text style={styles.issuedBy}>
            Issued by: {patient.referredBy}
          </Text>
          <Text style={styles.issuedBy}>
            Date: {formatDate(new Date())}
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text>
            Disclaimer: This is a generated radiology report based on images and clinical inputs provided by the referring center. 
            It is intended for use by qualified healthcare professionals. All findings should be correlated with clinical evaluation 
            and other investigations.
          </Text>
          <Text style={{ marginTop: 5 }}>
            The reporting radiologist and diagnostic center are not responsible for decisions made solely on the basis of this report. 
            A digital signature is included for verification.
          </Text>
        </View>

        {/* Footer Services */}
        {footerText && (
          <View style={styles.footer}>
            <Text>{footerText}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ReportPDF;
