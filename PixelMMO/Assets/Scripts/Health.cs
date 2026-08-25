using UnityEngine;
using System;

public class Health : MonoBehaviour
{
    public int maxHealth = 100;
    public int Current { get; private set; }
    public event Action<int,int> Changed;

    private void Awake() => Current = maxHealth;

    public void Damage(int amount)
    {
        Current = Mathf.Max(0, Current - Mathf.Abs(amount));
        Changed?.Invoke(Current, maxHealth);
        if (Current == 0) Die();
    }

    public void Heal(int amount)
    {
        Current = Mathf.Min(maxHealth, Current + Mathf.Abs(amount));
        Changed?.Invoke(Current, maxHealth);
    }

    private void Die()
    {
        if (CompareTag("Player"))
        {
            Current = maxHealth;
            transform.position = Vector3.zero;
            Changed?.Invoke(Current, maxHealth);
        }
        else Destroy(gameObject);
    }
}
