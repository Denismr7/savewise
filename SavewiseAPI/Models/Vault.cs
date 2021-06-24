using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Savewise.Models
{
    public class Vault
    {
        public int vId { get; set; }
        public string vName { get; set; }
        public int vUserId { get; set; }
        public double vAmount { get; set; }

        public ICollection<Transaction> transactions { get; set; }
    }

    public class VaultConfig : IEntityTypeConfiguration<Vault>
    {
        public void Configure(EntityTypeBuilder<Vault> builder)
        {
            builder.ToTable("vaults");

            builder.HasKey(v => v.vId)
                   .HasName("PK_Vaults");

            builder.Property(v => v.vId)
                   .HasColumnName("v_id")
                   .HasColumnType("int")
                   .ValueGeneratedOnAdd()
                   .IsRequired();

            builder.Property(t => t.vName)
                   .HasColumnName("v_name")
                   .HasColumnType("varchar")
                   .HasMaxLength(50)
                   .IsRequired();
            
            builder.Property(t => t.vAmount)
                   .HasColumnName("v_amount")
                   .HasColumnType("float")
                   .IsRequired();
            
            builder.Property(t => t.vUserId)
                   .HasColumnName("v_user_id")
                   .HasColumnType("int")
                   .IsRequired();
        }
    }
}