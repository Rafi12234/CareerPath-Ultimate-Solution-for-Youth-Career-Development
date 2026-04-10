<?php

return [
    'secret' => env('JWT_SECRET', env('APP_KEY')),
    'issuer' => env('JWT_ISSUER', env('APP_URL', 'http://localhost:8000')),
    'ttl_minutes' => (int) env('JWT_TTL_MINUTES', 10080),
];
