const fs = require('fs');
const path = require('path');

console.log('Applying react-native-share Android content URI patches...');

const baseDir = path.join(__dirname, '..', 'node_modules', 'react-native-share', 'android', 'src', 'main', 'java', 'cl', 'json');

// 1. Patch ShareFile.java
const shareFilePath = path.join(baseDir, 'ShareFile.java');
if (fs.existsSync(shareFilePath)) {
  let content = fs.readFileSync(shareFilePath, 'utf8');
  if (!content.includes('"content".equals(uri.getScheme())')) {
    content = content.replace(
      'Uri uri = Uri.parse(this.url);\n            if (uri.getPath() == null) {',
      'Uri uri = Uri.parse(this.url);\n            if ("content".equals(uri.getScheme())) {\n                return uri;\n            }\n            if (uri.getPath() == null) {'
    );
    fs.writeFileSync(shareFilePath, content, 'utf8');
    console.log('✓ Patched ShareFile.java');
  } else {
    console.log('• ShareFile.java already patched');
  }
} else {
  console.warn('! ShareFile.java not found at', shareFilePath);
}

// 2. Patch ShareFiles.java
const shareFilesPath = path.join(baseDir, 'ShareFiles.java');
if (fs.existsSync(shareFilesPath)) {
  let content = fs.readFileSync(shareFilesPath, 'utf8');
  if (!content.includes('"content".equals(uri.getScheme())')) {
    content = content.replace(
      '} else if(this.isLocalFile(uri)) {\n                if (uri.getPath() != null) {',
      '} else if(this.isLocalFile(uri)) {\n                if ("content".equals(uri.getScheme())) {\n                    finalUris.add(uri);\n                } else if (uri.getPath() != null) {'
    );
    fs.writeFileSync(shareFilesPath, content, 'utf8');
    console.log('✓ Patched ShareFiles.java');
  } else {
    console.log('• ShareFiles.java already patched');
  }
} else {
  console.warn('! ShareFiles.java not found at', shareFilesPath);
}

// 3. Patch RNSharePathUtil.java
const pathUtilPath = path.join(baseDir, 'RNSharePathUtil.java');
if (fs.existsSync(pathUtilPath)) {
  let content = fs.readFileSync(pathUtilPath, 'utf8');
  if (!content.includes('file.getPath().startsWith("content:")')) {
    content = content.replace(
      'if (file.getAbsolutePath().startsWith("content://")) {\n            return Uri.fromFile(file);\n        }',
      'if (file.getPath().startsWith("content:") || file.getAbsolutePath().startsWith("content://")) {\n            return Uri.parse(file.getPath());\n        }'
    );
    fs.writeFileSync(pathUtilPath, content, 'utf8');
    console.log('✓ Patched RNSharePathUtil.java');
  } else {
    console.log('• RNSharePathUtil.java already patched');
  }
} else {
  console.warn('! RNSharePathUtil.java not found at', pathUtilPath);
}

console.log('react-native-share patching complete.');
