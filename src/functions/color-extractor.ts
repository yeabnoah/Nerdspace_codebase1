/**
 * Extracts dominant colors from an image URL
 * @param imageUrl URL of the image to extract colors from
 * @returns Promise resolving to an array of color values in rgba format
 */
export async function extractColorsFromImage(
  imageUrl: string,
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Prevent CORS issues
    img.onload = () => {
      try {
        // Create a canvas to draw the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Simple color extraction - sample pixels at different positions
        const colorMap: Record<string, number> = {};

        // Sample every 10th pixel to improve performance
        for (let i = 0; i < pixels.length; i += 40) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Skip transparent pixels
          if (a < 128) continue;

          // Create a color key
          const colorKey = `${r},${g},${b}`;

          // Count occurrences of this color
          if (colorMap[colorKey]) {
            colorMap[colorKey]++;
          } else {
            colorMap[colorKey] = 1;
          }
        }

        // Sort colors by frequency
        const sortedColors = Object.entries(colorMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5) // Get top 5 colors
          .map(([color]) => {
            const [r, g, b] = color.split(",").map(Number);
            return `rgba(${r}, ${g}, ${b}, 0.4)`;
          });

        // If we couldn't extract enough colors, add some defaults
        if (sortedColors.length < 2) {
          sortedColors.push(
            "rgba(59, 130, 246, 0.4)",
            "rgba(249, 115, 22, 0.4)",
          );
        }

        resolve(sortedColors);
      } catch (error) {
        console.error("Error extracting colors:", error);
        reject(error);
      }
    };

    img.onerror = (error) => {
      console.error("Error loading image:", error);
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}
