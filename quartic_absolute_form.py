"""Can Ferrari's formula collapse into absolute-value functions, the way the
quadratic formula does for real roots?

Quadratic warm-up: for x^2 - e1*x + e2 with real roots r1, r2,
    sqrt(disc) = sqrt((r1 - r2)^2) = |r1 - r2|,
so the formula becomes  x = (e1 +/- |r1 - r2|)/2 = {max, min}.  The single
+/- ambiguity is a Z/2 (sign) ambiguity, and |.| is exactly the machine
that resolves Z/2: it turns a two-valued radical into a single-valued
real function.

Quartic: verified below --
  * every SQUARE-root layer collapses to |.| exactly as in the quadratic,
    giving the absolute-value form
        x in { (e1 + a1|s1| + a2|s2| + a3|s3|)/4 :
               a1*a2*a3 = sign(e1^3 - 4 e1 e2 + 8 e3) },
  * but the |s_k| require the roots of the resolvent CUBIC, and when all
    four quartic roots are real (and the resolvent is irreducible) that
    cubic hits the casus irreducibilis: its three real roots are provably
    NOT expressible in real radicals.  The cube-root ambiguity is Z/3 --
    a rotation among three real values, not a reflection between two --
    and no absolute value can resolve it.
  * Allowing cos/arccos in place of the cube root (Viete) gives a fully
    real, single-valued closed form, after which |.| handles the rest.
"""

import itertools

import sympy as sp

x, z, u = sp.symbols("x z u")
r1, r2, r3, r4 = R = sp.symbols("r1 r2 r3 r4", real=True)

e1 = r1 + r2 + r3 + r4
e2 = r1*r2 + r1*r3 + r1*r4 + r2*r3 + r2*r4 + r3*r4
e3 = r1*r2*r3 + r1*r2*r4 + r1*r3*r4 + r2*r3*r4
e4 = r1*r2*r3*r4
quartic = x**4 - e1*x**3 + e2*x**2 - e3*x + e4

s1 = r1 + r2 - r3 - r4
s2 = r1 - r2 + r3 - r4
s3 = r1 - r2 - r3 + r4
S = (s1, s2, s3)

resolvent = z**3 - e2*z**2 + (e1*e3 - 4*e4)*z - (e1**2*e4 - 4*e2*e4 + e3**2)


def is_zero(expr):
    return sp.expand(expr) == 0


def hr(title):
    print("\n" + "=" * 72)
    print(title)
    print("=" * 72)


# ----------------------------------------------------------------------
hr("0. Quadratic warm-up: the formula IS an absolute-value formula")

E1, E2 = r1 + r2, r1*r2
sqrt_disc2 = sp.sqrt(sp.factor(E1**2 - 4*E2))
print("sqrt(e1^2 - 4 e2) =", sqrt_disc2)          # sympy: Abs(r1 - r2)
assert sqrt_disc2 == sp.Abs(r1 - r2)
assert is_zero(sp.Max(r1, r2).rewrite(sp.Abs) - (E1 + sp.Abs(r1 - r2))/2)
assert is_zero(sp.Min(r1, r2).rewrite(sp.Abs) - (E1 - sp.Abs(r1 - r2))/2)
print("(e1 + |r1-r2|)/2 = Max(r1,r2),  (e1 - |r1-r2|)/2 = Min(r1,r2)"
      "  [verified]")
print("|.| resolves the single Z/2 branch: the formula returns the order")
print("statistics of the root multiset.")

# ----------------------------------------------------------------------
hr("1. Quartic: every square-root layer collapses to |.| the same way")

disc = sp.discriminant(quartic, x)
sqrt_disc = sp.sqrt(sp.factor(disc))
print("sqrt(disc) =", sqrt_disc)
assert sqrt_disc == sp.Abs(r1 - r2)*sp.Abs(r1 - r3)*sp.Abs(r1 - r4) \
    * sp.Abs(r2 - r3)*sp.Abs(r2 - r4)*sp.Abs(r3 - r4)
for k, sk in enumerate(S, 1):
    val = sp.sqrt(sp.factor(sp.expand(sk**2)))
    print(f"sqrt(s{k}^2) =", val)
    assert val == sp.Abs(sk)
print("Both perfect-square radicals simplify to absolute values, exactly")
print("as in the quadratic.  [verified]")

# ----------------------------------------------------------------------
hr("2. The absolute-value form of the four roots")

tau = e1**3 - 4*e1*e2 + 8*e3          # = s1*s2*s3, symmetric => computable
assert is_zero(tau - s1*s2*s3)

print("claim:  roots = { (e1 + a1|s1| + a2|s2| + a3|s3|)/4 ,")
print("                  a_k in {+1,-1},  a1*a2*a3 = sign(tau) },")
print("        tau = e1^3 - 4 e1 e2 + 8 e3  (= s1 s2 s3).")
print()

# Exhaustive symbolic proof over all sign regions: on the region where
# sign(s_k) = eps_k, we have |s_k| = eps_k * s_k and sign(tau) =
# eps1*eps2*eps3, so the allowed patterns are a = sigma*eps with
# sigma running over the product-(+1) set -- and those give exactly
# (e1 +/- s1 +/- s2 +/- s3)/4 with product +1, i.e. r1..r4.
true_set = {sp.expand(ri) for ri in R}
for eps in itertools.product((1, -1), repeat=3):
    prod_eps = eps[0]*eps[1]*eps[2]
    candidates = {
        sp.expand((e1 + a1*eps[0]*s1 + a2*eps[1]*s2 + a3*eps[2]*s3)/4)
        for a1, a2, a3 in itertools.product((1, -1), repeat=3)
        if a1*a2*a3 == prod_eps
    }
    assert candidates == true_set, (eps, candidates)
print("verified on all 8 sign regions of (s1,s2,s3): the candidate set is")
print("exactly {r1, r2, r3, r4}.  (On boundaries s_k = 0 both pattern")
print("families coincide, so the formula is continuous there.)")
print()
print("So at the square-root layer the quadratic picture generalizes")
print("perfectly -- the 2^3 sign ambiguity is pure Z/2 x Z/2 (after the")
print("product constraint) and |.| plus one computable sign resolves it.")

# ----------------------------------------------------------------------
hr("3. The obstruction: |s_k| needs the cubic layer, and casus irreducibilis")

# |s_k| = sqrt(e1^2 - 4 e2 + 4 y_k) where y_k are the resolvent cubic's
# roots.  How hard is that cubic?  Exactly as hard as the quartic:
disc_resolvent = sp.discriminant(resolvent, z)
assert is_zero(disc_resolvent - disc)
print("disc(resolvent cubic) == disc(quartic)   [verified]")
print("=> 4 distinct real quartic roots  <=>  3 distinct real cubic roots.")
print()

# Cardano on the depressed resolvent u^3 + P u + Q: the inner radical is
# sqrt(Q^2/4 + P^3/27), and that radicand is a negative multiple of disc:
depressed = sp.expand(resolvent.subs(z, u + e2/3))
P = depressed.coeff(u, 1)
Q = depressed.coeff(u, 0)
assert depressed.coeff(u, 2) == 0
assert is_zero(Q**2/4 + P**3/27 - (-disc/108))
# coefficient-level formulas used by the numeric routine in section 4:
assert is_zero(P - ((e1*e3 - 4*e4) - e2**2/3))
assert is_zero(Q - (-(e1**2*e4 - 4*e2*e4 + e3**2)
                    + e2*(e1*e3 - 4*e4)/3 - 2*e2**3/27))
print("Cardano's inner radicand  Q^2/4 + P^3/27 = -disc/108   [verified]")
print("disc > 0 (distinct real roots)  =>  radicand < 0  =>  the cube roots")
print("are cube roots of COMPLEX numbers.  Their threefold ambiguity is a")
print("phase exp(2*pi*I/3) -- a rotation among three real y_k -- not a +/-")
print("sign, so no absolute value can collapse it.  And this is not a")
print("failure of cleverness: by the casus irreducibilis theorem, an")
print("irreducible cubic with three real roots has NO expression in real")
print("radicals at all.  Hence no 'radicals + |.|' formula for the quartic")
print("exists in general.")

# ----------------------------------------------------------------------
hr("4. What DOES exist: trig (Viete) for the cubic layer + |.| for the rest")


def quartic_roots_real_closed_form(c1, c2, c3, c4):
    """Fully real, single-valued closed form for the roots of
    x^4 - c1 x^3 + c2 x^2 - c3 x + c4, assuming all roots are real.

    cos/arccos replaces the cube root (Viete); absolute values -- via the
    guaranteed-nonnegative sqrt arguments -- replace every +/- square
    root; one computable sign (tau) picks the branch family.
    """
    c1, c2, c3, c4 = [sp.Float(c, 30) for c in (c1, c2, c3, c4)]
    p = (c1*c3 - 4*c4) - c2**2/3
    q = -(c1**2*c4 - 4*c2*c4 + c3**2) + c2*(c1*c3 - 4*c4)/3 - 2*c2**3/27
    # y_k: three real roots of the resolvent, no cube roots needed
    if abs(p) < 1e-25:                       # triple root of the resolvent
        ys = [c2/3 - sp.real_root(q, 3)]*3
    else:
        m = 2*sp.sqrt(-p/3)
        theta = sp.acos(sp.Max(-1, sp.Min(1, 3*q/(m*p)))) / 3
        ys = [c2/3 + m*sp.cos(theta - 2*sp.pi*k/3) for k in range(3)]
    abs_s = [sp.sqrt(sp.Max(0, c1**2 - 4*c2 + 4*y)) for y in ys]
    tau = c1**3 - 4*c1*c2 + 8*c3
    sign = 1 if tau >= 0 else -1
    return sorted(
        sp.N((c1 + a1*abs_s[0] + a2*abs_s[1] + a3*abs_s[2])/4)
        for a1, a2, a3 in itertools.product((1, -1), repeat=3)
        if a1*a2*a3 == sign
    )


test_sets = [
    (1, 2, 3, 5),        # tau > 0
    (-10, 1, 2, 3),      # exercises the other branch family if tau < 0
    (-3, -1, 2, 7),
    (1, 2, 2, 5),        # repeated root
    (-2, -2, 2, 2),      # tau = 0 (symmetric roots)
]
for roots in test_sets:
    c1 = sum(roots)
    c2 = sum(a*b for a, b in itertools.combinations(roots, 2))
    c3 = sum(a*b*c for a, b, c in itertools.combinations(roots, 3))
    c4 = roots[0]*roots[1]*roots[2]*roots[3]
    tau_num = c1**3 - 4*c1*c2 + 8*c3
    got = quartic_roots_real_closed_form(c1, c2, c3, c4)
    expect = sorted(sp.Float(r, 30) for r in roots)
    err = max(abs(g - e) for g, e in zip(got, expect))
    assert err < 1e-20, (roots, got)
    print(f"roots {str(roots):<18} sign(tau) = {int(sp.sign(tau_num)):+d}"
          f"   recovered, max err = {sp.N(err, 2)}")

print()
print("Summary: the quadratic's '|.| collapse' generalizes to every")
print("square-root layer of Ferrari's formula, but the quartic has one")
print("layer the quadratic doesn't -- the resolvent cubic -- and its Z/3")
print("ambiguity is beyond what absolute values (Z/2 resolvers) can fix.")
print("Real single-valued closed form: yes, but with arccos, not radicals.")
