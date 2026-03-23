<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        // Always return structured JSON for API validation errors.
        // Falling back to web-style validation responses can trigger 500s in API contexts.
        if ($exception instanceof ValidationException) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $exception->getMessage() ?: 'The given data was invalid.',
                    'errors' => $exception->errors(),
                ], 422);
            }

            return parent::render($request, $exception);
        }

        // Let Laravel handle auth errors normally (401)
        if ($exception instanceof AuthenticationException) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Let Laravel handle HTTP exceptions (404, 403, etc.)
        if ($exception instanceof HttpException) {
            return parent::render($request, $exception);
        }

        // For API requests, return JSON error
        if ($request->expectsJson() || $request->is('api/*')) {
            Log::error('API unhandled exception', [
                'path' => $request->path(),
                'method' => $request->method(),
                'origin' => $request->headers->get('origin'),
                'referer' => $request->headers->get('referer'),
                'user_agent' => $request->userAgent(),
                'exception_class' => get_class($exception),
                'exception_message' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);

            return response()->json([
                'error' => true,
                'message' => config('app.debug') ? $exception->getMessage() : 'An unexpected error occurred',
            ], 500);
        }

        return parent::render($request, $exception);
    }
}
