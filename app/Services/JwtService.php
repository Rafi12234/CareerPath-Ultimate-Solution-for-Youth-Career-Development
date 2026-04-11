<?php

namespace App\Services;

use DateTimeImmutable;
use Lcobucci\Clock\SystemClock;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Throwable;

class JwtService
{
    private Configuration $config;

    public function __construct()
    {
        $secret = (string) config('jwt.secret', env('JWT_SECRET', config('app.key')));
        $this->config = Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::plainText($secret)
        );
    }

    public function createToken(int $userId, string $jti): array
    {
        $now = new DateTimeImmutable();
        $ttlMinutes = (int) config('jwt.ttl_minutes', 60 * 24 * 7);
        $expiresAt = $now->modify('+' . $ttlMinutes . ' minutes');

        $token = $this->config->builder()
            ->issuedBy((string) config('jwt.issuer', config('app.url')))
            ->issuedAt($now)
            ->expiresAt($expiresAt)
            ->identifiedBy($jti)
            ->withClaim('uid', $userId)
            ->getToken($this->config->signer(), $this->config->signingKey());

        return [
            'token' => $token->toString(),
            'expires_at' => $expiresAt,
        ];
    }

    public function validateAndDecode(string $token): ?array
    {
        try {
            $parsedToken = $this->config->parser()->parse($token);
            if (!$this->config->validator()->validate(
                $parsedToken,
                new SignedWith($this->config->signer(), $this->config->verificationKey())
            )) {
                return null;
            }

            $claims = $parsedToken->claims();
            $uid = $claims->get('uid');
            $jti = $claims->get('jti');
            $exp = $claims->get('exp');
            $now = new DateTimeImmutable('now', new \DateTimeZone('UTC'));

            if (!is_numeric($uid) || !is_string($jti) || !$exp instanceof DateTimeImmutable) {
                return null;
            }

            if ($exp <= $now) {
                return null;
            }

            return [
                'uid' => (int) $uid,
                'jti' => $jti,
                'exp' => $exp,
            ];
        } catch (Throwable $e) {
            return null;
        }
    }
}
