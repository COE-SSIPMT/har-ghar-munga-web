<?php
// Common configuration settings
class Config {
    // Base URL - same as Flutter app's ApiConfig
    const BASE_URL = 'http://10.0.2.2/hgm';
    
    // Helper method to get full URL for uploads
    public static function getUploadUrl($filename) {
        // Agar already full URL hai to waisa hi return kar do
        if (preg_match('/^https?:\/\//', $filename)) {
            return $filename;
        }
        // Agar sirf filename hai to BASE_URL ke sath jodo
        return rtrim(self::BASE_URL, '/') . '/uploads/' . ltrim($filename, '/');
    }
}
?>
